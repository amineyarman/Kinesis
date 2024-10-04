import { TransformAxisType, TransformType, InteractionAxisType } from "./types";
import { parseTransformAxes } from "./utils";

class KinesisTransformerElement {
  element: HTMLElement;
  strength!: number;
  type!: TransformType;
  transformAxis!: TransformAxisType[];
  interactionAxis!: InteractionAxisType | null;
  initialTransform!: string;
  transformOrigin!: string;
  mutationObserver!: MutationObserver;
  rafId: number | null = null;

  constructor(element: HTMLElement) {
    if (!element.hasAttribute("data-kinesistransformer-element")) {
      throw new Error(
        "Element does not have the 'data-kinesistransformer-element' attribute."
      );
    }

    this.element = element;
    this.updatePropertiesFromAttributes();

    const computedStyle = window.getComputedStyle(this.element);
    this.initialTransform =
      computedStyle.transform === "none" ? "" : computedStyle.transform;

    this.element.style.transformOrigin = this.transformOrigin;

    this.mutationObserver = new MutationObserver(this.handleAttributeChange);
    this.mutationObserver.observe(this.element, {
      attributes: true,
      attributeFilter: [
        "data-ks-strength",
        "data-ks-transform",
        "data-ks-transformaxis",
        "data-ks-interactionaxis",
        "data-ks-transformorigin",
      ],
    });
  }

  updatePropertiesFromAttributes() {
    const strengthAttr = this.element.getAttribute("data-ks-strength");
    const parsedStrength = parseFloat(strengthAttr || "10");
    this.strength = isNaN(parsedStrength) ? 10 : parsedStrength;

    this.type =
      (this.element.getAttribute("data-ks-transform") as TransformType) ||
      "translate";

    const transformAxisAttribute =
      this.element.getAttribute("data-ks-transformaxis") ||
      (this.type === "rotate" ? "Z" : "X, Y");
    this.transformAxis = parseTransformAxes(transformAxisAttribute);

    const interactionAxisAttribute = this.element.getAttribute(
      "data-ks-interactionaxis"
    );
    this.interactionAxis = interactionAxisAttribute
      ? (interactionAxisAttribute.trim().toUpperCase() as InteractionAxisType)
      : null;

    if (this.interactionAxis && !["X", "Y"].includes(this.interactionAxis)) {
      console.warn(
        "Invalid value for data-ks-interactionaxis. Acceptable values are 'X' or 'Y'."
      );
      this.interactionAxis = null;
    }

    this.transformOrigin =
      this.element.getAttribute("data-ks-transformorigin") || "center center";

    this.element.style.transformOrigin = this.transformOrigin;
  }

  handleAttributeChange = (mutationsList: MutationRecord[]) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes") {
        this.updatePropertiesFromAttributes();
      }
    }
  };

  applyTransform(x: number, y: number) {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.rafId = requestAnimationFrame(() => {
      this.performTransform(x, y);
    });
  }

  performTransform(x: number, y: number) {
    let transformValue = "";

    const { strength, type, transformAxis, interactionAxis } = this;

    if (interactionAxis === "X") {
      y = 0;
    } else if (interactionAxis === "Y") {
      x = 0;
    }

    const compensationFactor = interactionAxis ? 2 : 1;

    const singleAxis = transformAxis.length === 1;
    let combinedValue = 0;

    if (singleAxis) {
      const weightX = 1;
      const weightY = 1;
      combinedValue = x * weightX + y * weightY;
    }

    switch (type) {
      case "translate": {
        let translateX = 0;
        let translateY = 0;
        let translateZ = 0;

        if (transformAxis.includes("X")) {
          translateX = singleAxis ? combinedValue * strength : x * strength;
        }
        if (transformAxis.includes("Y")) {
          translateY = singleAxis ? combinedValue * strength : y * strength;
        }
        if (transformAxis.includes("Z")) {
          const sumOfAxes = x + y;
          translateZ = sumOfAxes * compensationFactor * strength;
        }

        transformValue = `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`;
        break;
      }
      case "rotate": {
        let rotateX = 0;
        let rotateY = 0;
        let rotateZ = 0;

        if (transformAxis.includes("X")) {
          rotateX = singleAxis ? combinedValue * strength : y * strength;
        }
        if (transformAxis.includes("Y")) {
          rotateY = singleAxis ? combinedValue * strength : x * strength;
        }
        if (transformAxis.includes("Z")) {
          const sumOfAxes = x + y;
          rotateZ = sumOfAxes * compensationFactor * strength;
        }

        const axisXComponent = rotateX !== 0 ? 1 : 0;
        const axisYComponent = rotateY !== 0 ? 1 : 0;
        const axisZComponent = rotateZ !== 0 ? 1 : 0;
        const rotationValue = rotateX || rotateY || rotateZ;

        transformValue = `rotate3d(${axisXComponent}, ${axisYComponent}, ${axisZComponent}, ${rotationValue}deg)`;
        break;
      }
      case "scale": {
        let scaleX = 1;
        let scaleY = 1;
        let scaleZ = 1;

        if (transformAxis.includes("X")) {
          scaleX = singleAxis
            ? 1 + combinedValue * strength * 0.01
            : 1 + x * strength * 0.01;
        }
        if (transformAxis.includes("Y")) {
          scaleY = singleAxis
            ? 1 + combinedValue * strength * 0.01
            : 1 + y * strength * 0.01;
        }
        if (transformAxis.includes("Z")) {
          const sumOfAxes = x + y;
          scaleZ = 1 + sumOfAxes * compensationFactor * strength * 0.01;
        }

        transformValue = `scale3d(${scaleX}, ${scaleY}, ${scaleZ})`;
        break;
      }
      case "tilt": {
        let rotateYComponent = 0;
        let rotateXComponent = 0;

        if (transformAxis.includes("X")) {
          rotateYComponent = singleAxis
            ? combinedValue * strength
            : y * strength;
        }
        if (transformAxis.includes("Y")) {
          rotateXComponent = singleAxis
            ? combinedValue * strength
            : x * strength;
        }

        transformValue = `rotateX(${rotateYComponent}deg) rotateY(${-rotateXComponent}deg) translate3d(0,0,${
          strength * 2
        }px)`;
        break;
      }
      case "tilt_inv": {
        let rotateYComponent = 0;
        let rotateXComponent = 0;

        if (transformAxis.includes("X")) {
          rotateYComponent = singleAxis
            ? combinedValue * strength
            : y * strength;
        }
        if (transformAxis.includes("Y")) {
          rotateXComponent = singleAxis
            ? combinedValue * strength
            : x * strength;
        }

        transformValue = `rotateX(${-rotateYComponent}deg) rotateY(${rotateXComponent}deg) translate3d(0,0,${
          strength * 2
        }px)`;
        break;
      }
    }

    this.element.style.transform =
      `${this.initialTransform} ${transformValue}`.trim();

    this.rafId = null;
  }

  resetTransform() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.element.style.transform = this.initialTransform;
  }

  destroy() {
    this.mutationObserver.disconnect();
  }
}

export default KinesisTransformerElement;
