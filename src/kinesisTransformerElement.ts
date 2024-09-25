import { TransformAxisType, TransformType, ConstraintAxisType } from "./types";
import { parseTransformAxes } from "./utils";

class KinesisTransformerElement {
  element: HTMLElement;
  strength!: number; // Definite assignment assertion
  type: TransformType;
  transformAxis: TransformAxisType[];
  constraintAxis: ConstraintAxisType | null;
  initialTransform: string;
  transformOrigin: string;
  mutationObserver: MutationObserver;

  constructor(element: HTMLElement) {
    if (!element.hasAttribute("data-kinesistransformer-element")) {
      throw new Error(
        "Element does not have the 'data-kinesistransformer-element' attribute."
      );
    }

    this.element = element;

    // Initialize 'strength' before any method uses it
    this.updateStrengthFromAttribute();

    // Get the transform type, defaulting to "translate"
    this.type =
      (element.getAttribute("data-ks-transform") as TransformType) ||
      "translate";

    // Get the transformAxis or default to Z axis for "rotate", otherwise "X, Y"
    const transformAxisAttribute =
      element.getAttribute("data-ks-transformAxis") ||
      (this.type === "rotate" ? "Z" : "X, Y");
    this.transformAxis = parseTransformAxes(transformAxisAttribute);

    // Get the constraint axis, accepts "X" or "Y", or null if not set
    const constraintAxisAttribute = element.getAttribute(
      "data-ks-constraintAxis"
    );
    this.constraintAxis = constraintAxisAttribute
      ? (constraintAxisAttribute.trim().toUpperCase() as ConstraintAxisType)
      : null;

    // Validate constraintAxis
    if (this.constraintAxis && !["X", "Y"].includes(this.constraintAxis)) {
      throw new Error(
        "Invalid value for data-ks-constraintAxis. Acceptable values are 'X' or 'Y'."
      );
    }

    // Get the transform origin, defaulting to "center center"
    this.transformOrigin =
      element.getAttribute("data-ks-transformOrigin") || "center center";

    // Apply the transform-origin to the element
    this.element.style.transformOrigin = this.transformOrigin;

    // Get the initial transform style of the element
    const computedStyle = window.getComputedStyle(this.element);
    this.initialTransform =
      computedStyle.transform === "none" ? "" : computedStyle.transform;

    // Set up MutationObserver to watch for changes to data-ks-strength
    this.mutationObserver = new MutationObserver(this.handleAttributeChange);
    this.mutationObserver.observe(this.element, {
      attributes: true,
      attributeFilter: ["data-ks-strength"],
    });
  }

  updateStrengthFromAttribute() {
    const strengthAttr = this.element.getAttribute("data-ks-strength");
    const parsedStrength = parseFloat(strengthAttr || "10");
    this.strength = isNaN(parsedStrength) ? 10 : parsedStrength;
  }

  handleAttributeChange = (mutationsList: MutationRecord[]) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-ks-strength"
      ) {
        this.updateStrengthFromAttribute();
      }
    }
  };

  applyTransform(x: number, y: number) {
    if (this.strength === 0) {
      this.resetTransform();
      return;
    }

    let transformValue = "";

    const { strength, type, transformAxis, constraintAxis } = this;

    // Apply constraintAxis to x and y
    if (constraintAxis === "X") {
      console.log("X");
      y = 0;
    } else if (constraintAxis === "Y") {
      console.log("Y");

      x = 0;
    }

    // Compensation factor for when only one axis contributes
    const compensationFactor = constraintAxis ? 2 : 1;

    switch (type) {
      case "translate": {
        const translateX = transformAxis.includes("X") ? x * strength : 0;
        const translateY = transformAxis.includes("Y") ? y * strength : 0;
        let translateZ = 0;
        if (transformAxis.includes("Z")) {
          const sumOfAxes = x + y;
          translateZ = sumOfAxes * compensationFactor * strength;
        }
        transformValue = `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`;
        break;
      }
      case "rotate": {
        const rotateX = transformAxis.includes("X") ? y * strength : 0;
        const rotateY = transformAxis.includes("Y") ? x * strength : 0;
        let rotateZ = 0;
        if (transformAxis.includes("Z")) {
          if (constraintAxis === "X") {
            y = x;
          } else if (constraintAxis === "Y") {
            x = y;
          }
          const sumOfAxes = x + y;
          console.log(x, y, sumOfAxes);
          rotateZ = sumOfAxes * compensationFactor * strength;
        }

        // Determine the axis components for rotate3d
        const axisXComponent = rotateX !== 0 ? 1 : 0;
        const axisYComponent = rotateY !== 0 ? 1 : 0;
        const axisZComponent = rotateZ !== 0 ? 1 : 0;
        const rotationValue = rotateX || rotateY || rotateZ;

        transformValue = `rotate3d(${axisXComponent}, ${axisYComponent}, ${axisZComponent}, ${rotationValue}deg)`;
        break;
      }
      case "scale": {
        const scaleX = transformAxis.includes("X")
          ? 1 + x * strength * 0.01
          : 1;
        const scaleY = transformAxis.includes("Y")
          ? 1 + y * strength * 0.01
          : 1;
        let scaleZ = 1;
        if (transformAxis.includes("Z")) {
          const sumOfAxes = x + y;
          scaleZ = 1 + sumOfAxes * compensationFactor * strength * 0.01;
        }
        transformValue = `scale3d(${scaleX}, ${scaleY}, ${scaleZ})`;
        break;
      }
      case "tilt": {
        const rotateYComponent = transformAxis.includes("X") ? y * strength : 0;
        const rotateXComponent = transformAxis.includes("Y") ? x * strength : 0;
        transformValue = `rotateX(${rotateYComponent}deg) rotateY(${-rotateXComponent}deg) translate3d(0,0,${
          strength * 2
        }px)`;
        break;
      }
      case "tilt_inv": {
        const rotateYComponent = transformAxis.includes("X") ? y * strength : 0;
        const rotateXComponent = transformAxis.includes("Y") ? x * strength : 0;
        transformValue = `rotateX(${-rotateYComponent}deg) rotateY(${rotateXComponent}deg) translate3d(0,0,${
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

  // Disconnect the observer when no longer needed
  disconnectObserver() {
    this.mutationObserver.disconnect();
  }
}

export default KinesisTransformerElement;
