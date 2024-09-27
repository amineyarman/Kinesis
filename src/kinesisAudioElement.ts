import { TransformType, TransformAxisType } from "./types";
import { parseTransformAxes } from "./utils";

class KinesisAudioElement {
  element: HTMLElement;
  audioIndex: number;
  strength: number;
  type: TransformType;
  transformAxis: TransformAxisType[];
  transformOrigin: string;
  initialTransform: string;

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

    const axisAttr = element.getAttribute("data-ks-transformAxis");
    if (axisAttr) {
      this.transformAxis = parseTransformAxes(axisAttr);
      if (this.transformAxis.length === 0) {
        this.transformAxis = this.getDefaultAxes();
      }
    } else {
      this.transformAxis = this.getDefaultAxes();
    }

    const computedStyle = window.getComputedStyle(this.element);
    this.initialTransform =
      computedStyle.transform === "none" ? "" : computedStyle.transform;

    this.element.style.transformOrigin = this.transformOrigin;
    this.element.style.transform = this.initialTransform;

    this.element.style.setProperty("--transform-duration", "0.1s");
    this.element.style.transition = `transform var(--transform-duration) ease-out`;

    this.element.style.willChange = "transform";
  }

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
    const { strength, type, transformAxis } = this;

    const transforms: string[] = [];

    transformAxis.forEach((transformAxis) => {
      switch (type) {
        case "translate": {
          if (
            transformAxis === "X" ||
            transformAxis === "Y" ||
            transformAxis === "Z"
          ) {
            const translate = value * strength;
            const translateX = transformAxis === "X" ? translate : 0;
            const translateY = transformAxis === "Y" ? translate : 0;
            const translateZ = transformAxis === "Z" ? translate : 0;
            transforms.push(
              `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`
            );
          }
          break;
        }
        case "rotate": {
          if (
            transformAxis === "X" ||
            transformAxis === "Y" ||
            transformAxis === "Z"
          ) {
            const rotate = value * strength;
            transforms.push(`rotate${transformAxis}(${rotate}deg)`);
          }
          break;
        }
        case "scale": {
          if (
            transformAxis === "X" ||
            transformAxis === "Y" ||
            transformAxis === "Z"
          ) {
            const scale = 1 + value * strength * 0.1;
            const scaleX = transformAxis === "X" ? scale : 1;
            const scaleY = transformAxis === "Y" ? scale : 1;
            const scaleZ = transformAxis === "Z" ? scale : 1;
            transforms.push(`scale3d(${scaleX}, ${scaleY}, ${scaleZ})`);
          }
          break;
        }
        default:
          break;
      }
    });

    const transformValue = transforms.join(" ");

    const isRising = value > this.previousValue;

    if (isRising) {
      this.element.style.setProperty("--transform-duration", "0.05s");
    } else {
      this.element.style.setProperty("--transform-duration", "0.3s");
    }

    this.element.style.transform =
      `${this.initialTransform} ${transformValue}`.trim();

    this.previousValue = value;
  }

  resetTransform() {
    this.element.style.setProperty("--transform-duration", "0.5s");
    this.element.style.transform = this.initialTransform;
    this.previousValue = 0;
  }
}

export default KinesisAudioElement;
