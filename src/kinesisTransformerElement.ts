import { AxisType, TransformType } from "./types";
import { parseAxes } from "./utils";

class KinesisTransformerElement {
  element: HTMLElement;
  strength: number;
  type: TransformType;
  axis: AxisType[];
  initialTransform: string;
  transformOrigin: string;

  constructor(element: HTMLElement) {
    if (!element.hasAttribute("data-kinesistransformer-element")) {
      throw new Error(
        "Element does not have the 'data-kinesistransformer-element' attribute."
      );
    }

    this.element = element;

    // Get the transform type, defaulting to "translate"
    this.type =
      (element.getAttribute("data-ks-transform") as TransformType) ||
      "translate";

    // Get the strength value or default to 10
    this.strength = parseFloat(
      element.getAttribute("data-ks-strength") || "10"
    );

    // Get the axis or default to Z axis for "rotate", otherwise "X, Y"
    const axisAttribute =
      element.getAttribute("data-ks-axis") ||
      (this.type === "rotate" ? "Z" : "X, Y");
    this.axis = parseAxes(axisAttribute);

    // Get the transform origin, defaulting to "center center"
    this.transformOrigin =
      element.getAttribute("data-ks-transformOrigin") || "center center";

    // Apply the transform-origin to the element
    this.element.style.transformOrigin = this.transformOrigin;

    // Get the initial transform style of the element
    const computedStyle = window.getComputedStyle(this.element);
    this.initialTransform =
      computedStyle.transform === "none" ? "" : computedStyle.transform;
  }

  applyTransform(x: number, y: number) {
    let transformValue = "";

    const { strength, type, axis } = this;

    switch (type) {
      case "translate": {
        const translateX = axis.includes("X") ? x * strength : 0;
        const translateY = axis.includes("Y") ? y * strength : 0;
        const translateZ = axis.includes("Z") ? (x + y) * strength : 0;
        transformValue = `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`;
        break;
      }
      case "rotate": {
        // Use rotate3d to handle rotation on all axes
        const rotateX = axis.includes("X") ? y * strength : 0;
        const rotateY = axis.includes("Y") ? x * strength : 0;
        const rotateZ = axis.includes("Z") ? (x + y) * strength : 0;

        // Rotate based on the provided axes using rotate3d
        transformValue = `rotate3d(${rotateX !== 0 ? 1 : 0}, ${
          rotateY !== 0 ? 1 : 0
        }, ${rotateZ !== 0 ? 1 : 0}, ${rotateX || rotateY || rotateZ}deg)`;
        break;
      }
      case "scale": {
        const scaleX = axis.includes("X") ? 1 + x * strength * 0.01 : 1;
        const scaleY = axis.includes("Y") ? 1 + y * strength * 0.01 : 1;
        const scaleZ = axis.includes("Z") ? 1 + (x + y) * strength * 0.01 : 1;
        transformValue = `scale3d(${scaleX}, ${scaleY}, ${scaleZ})`;
        break;
      }
      case "tilt": {
        const rotateY = axis.includes("X") ? y * strength : 0;
        const rotateX = axis.includes("Y") ? x * strength : 0;
        transformValue = `rotateX(${rotateY}deg) rotateY(${-rotateX}deg) translate3d(0,0,${
          strength * 2
        }px)`;
        break;
      }
      case "tilt_inv": {
        const rotateY = axis.includes("X") ? y * strength : 0;
        const rotateX = axis.includes("Y") ? x * strength : 0;
        transformValue = `rotateX(${-rotateY}deg) rotateY(${rotateX}deg) translate3d(0,0,${
          strength * 2
        }px)`;
        break;
      }
    }

    // Apply the final transform
    this.element.style.transform =
      `${this.initialTransform} ${transformValue}`.trim();
  }

  resetTransform() {
    // Reset the element's transform to its initial state
    this.element.style.transform = this.initialTransform;
  }
}

export default KinesisTransformerElement;
