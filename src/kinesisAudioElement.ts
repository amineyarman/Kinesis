// kinesisAudioElement.ts

import { TransformType, TransformAxisType } from "./types";
import { parseTransformAxes } from "./utils";

class KinesisAudioElement {
  element: HTMLElement;
  audioIndex: number;
  strength: number;
  type: TransformType;
  axes: TransformAxisType[];
  transformOrigin: string;
  initialTransform: string;

  // Track the previous value to determine if the frequency is increasing or decreasing
  private previousValue: number = 0;

  constructor(element: HTMLElement) {
    if (!element.hasAttribute("data-kinesisaudio-element")) {
      throw new Error(
        "Element does not have the 'data-kinesisaudio-element' attribute."
      );
    }

    this.element = element;
    this.audioIndex = parseInt(
      element.getAttribute("data-ks-audioindex") || "50"
    );
    this.strength = parseFloat(
      element.getAttribute("data-ks-strength") || "10"
    );
    this.type =
      (element.getAttribute("data-ks-type") as TransformType) || "translate";
    this.transformOrigin =
      element.getAttribute("data-ks-transformorigin") || "center";

    // Parse data-ks-axis attribute
    const axisAttr = element.getAttribute("data-ks-axis");
    if (axisAttr) {
      this.axes = parseTransformAxes(axisAttr);
      if (this.axes.length === 0) {
        // If parsing results in no valid axes, fallback to defaults
        this.axes = this.getDefaultAxes();
      }
    } else {
      // Set default axes based on transform type
      this.axes = this.getDefaultAxes();
    }

    const computedStyle = window.getComputedStyle(this.element);
    this.initialTransform =
      computedStyle.transform === "none" ? "" : computedStyle.transform;

    this.element.style.transformOrigin = this.transformOrigin;
    this.element.style.transform = this.initialTransform;

    // Initialize CSS variables for dynamic transition durations
    this.element.style.setProperty("--transform-duration", "0.1s");
    this.element.style.transition = `transform var(--transform-duration) ease-out`;

    // Improve performance by hinting the browser
    this.element.style.willChange = "transform";
  }

  /**
   * Returns default axes based on the TransformType
   */
  private getDefaultAxes(): TransformAxisType[] {
    switch (this.type) {
      case "translate":
        return ["Y"];
      case "rotate":
        return ["Z"];
      case "scale":
      default:
        return ["X", "Y"];
    }
  }

  applyTransform(value: number) {
    const { strength, type, axes } = this;

    const transforms: string[] = [];

    axes.forEach((axis) => {
      switch (type) {
        case "translate": {
          if (axis === "X" || axis === "Y" || axis === "Z") {
            const translate = value * strength;
            // For translate, set the axis being transformed and others to 0
            const translateX = axis === "X" ? translate : 0;
            const translateY = axis === "Y" ? translate : 0;
            const translateZ = axis === "Z" ? translate : 0;
            transforms.push(
              `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`
            );
          }
          break;
        }
        case "rotate": {
          if (axis === "X" || axis === "Y" || axis === "Z") {
            const rotate = value * strength;
            // Rotate around the specified axis
            transforms.push(`rotate${axis}(${rotate}deg)`);
          }
          break;
        }
        case "scale": {
          if (axis === "X" || axis === "Y" || axis === "Z") {
            // Scaling factors for x, y, z
            const scale = 1 + value * strength * 0.1;
            const scaleX = axis === "X" ? scale : 1;
            const scaleY = axis === "Y" ? scale : 1;
            const scaleZ = axis === "Z" ? scale : 1;
            transforms.push(`scale3d(${scaleX}, ${scaleY}, ${scaleZ})`);
          }
          break;
        }
        default:
          break;
      }
    });

    const transformValue = transforms.join(" ");

    // Determine if the frequency is increasing or decreasing
    const isRising = value > this.previousValue;

    // Set transition duration based on the frequency change
    if (isRising) {
      // Quick rise
      this.element.style.setProperty("--transform-duration", "0.05s");
    } else {
      // Slow decay
      this.element.style.setProperty("--transform-duration", "0.3s");
    }

    // Update the transform
    this.element.style.transform =
      `${this.initialTransform} ${transformValue}`.trim();

    // Update the previous value
    this.previousValue = value;
  }

  resetTransform() {
    this.element.style.setProperty("--transform-duration", "0.5s"); // Slow reset
    this.element.style.transform = this.initialTransform;
    this.previousValue = 0;
  }
}

export default KinesisAudioElement;
