import { AxisType, TransformType } from "./types";
import { parseAxes } from "./utils";

class KinesisTransformerElement {
  element: HTMLElement;
  strength: number;
  type: TransformType;
  axis: AxisType[];
  initialTransform: string;

  constructor(element: HTMLElement, transformType: TransformType) {
    if (!element.hasAttribute("data-kinesistransformer-element")) {
      throw new Error(
        "Element does not have the 'data-kinesistransformer-element' attribute."
      );
    }

    this.element = element;
    this.strength = parseFloat(
      element.getAttribute("data-ks-strength") || "10"
    );
    this.type = transformType || "translate";
    this.axis = parseAxes(element.getAttribute("data-ks-axis") || "X, Y");

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
        const rotateX = axis.includes("X") ? y * strength : 0;
        const rotateY = axis.includes("Y") ? x * strength : 0;
        const rotateZ = axis.includes("Z") ? (x + y) * strength : 0;
        transformValue = "";
        if (axis.includes("X")) transformValue += ` rotateX(${rotateX}deg)`;
        if (axis.includes("Y")) transformValue += ` rotateY(${rotateY}deg)`;
        if (axis.includes("Z")) transformValue += ` rotateZ(${rotateZ}deg)`;
        transformValue = transformValue.trim();
        break;
      }
      case "scale": {
        const scaleX = axis.includes("X") ? 1 + x * strength * 0.01 : 1;
        const scaleY = axis.includes("Y") ? 1 + y * strength * 0.01 : 1;
        const scaleZ = axis.includes("Z") ? 1 + (x + y) * strength * 0.01 : 1;
        transformValue = `scale3d(${scaleX}, ${scaleY}, ${scaleZ})`;
        break;
      }
    }

    this.element.style.transform =
      `${this.initialTransform} ${transformValue}`.trim();
  }

  resetTransform() {
    this.element.style.transform = this.initialTransform;
  }
}

export default KinesisTransformerElement;
