import { TransformType } from "./types";

class KinesisAudioElement {
  element: HTMLElement;
  audioIndex: number;
  strength: number;
  type: TransformType;
  transformOrigin: string;
  initialTransform: string;

  constructor(element: HTMLElement) {
    if (!element.hasAttribute("data-audioelement")) {
      throw new Error(
        "Element does not have the 'data-audioelement' attribute."
      );
    }

    this.element = element;
    this.audioIndex = parseInt(element.getAttribute("data-audioindex") || "50");
    this.strength = parseFloat(element.getAttribute("data-strength") || "10");
    this.type =
      (element.getAttribute("data-type") as TransformType) || "translate";
    this.transformOrigin =
      element.getAttribute("data-transformorigin") || "center";

    const computedStyle = window.getComputedStyle(this.element);
    this.initialTransform =
      computedStyle.transform === "none" ? "" : computedStyle.transform;

    this.element.style.transformOrigin = this.transformOrigin;
    this.element.style.transform = this.initialTransform;
    this.element.style.transition = `transform 0.1s ease-out`;
  }

  applyTransform(value: number) {
    let transformValue = "";

    const { strength, type } = this;

    switch (type) {
      case "translate": {
        const translateX = value * strength;
        const translateY = value * strength;
        transformValue = `translate(${translateX}px, ${translateY}px)`;
        break;
      }
      case "rotate": {
        const rotate = value * strength;
        transformValue = `rotate(${rotate}deg)`;
        break;
      }
      case "scale": {
        const scale = 1 + value * strength * 0.01;
        transformValue = `scale(${scale})`;
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

export default KinesisAudioElement;
