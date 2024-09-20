import { KinesisScrollItemOptions, AxisType, TransformType } from "./types";
import { parseAxes, clamp } from "./utils";

class KinesisScrollItem {
  element: HTMLElement;
  options: KinesisScrollItemOptions;
  isActive: boolean;
  initialTransform: string;
  transformType: TransformType;
  axis: AxisType[];
  strength: number;
  observer: IntersectionObserver | null = null;

  constructor(element: HTMLElement, options: KinesisScrollItemOptions = {}) {
    if (!element.hasAttribute("data-kinesisscroll-item")) {
      throw new Error(
        "Element does not have the 'data-kinesisscroll-item' attribute."
      );
    }

    this.element = element;
    this.options = {
      active: options.active !== undefined ? options.active : true,
      duration:
        options.duration ||
        parseInt(element.getAttribute("data-ks-duration") || "1000"),
      easing:
        options.easing ||
        element.getAttribute("data-ks-easing") ||
        "cubic-bezier(0.23, 1, 0.32, 1)",
      transformType:
        options.transformType ||
        (element.getAttribute("data-ks-transform") as TransformType) ||
        "translate",
      axis: options.axis || element.getAttribute("data-ks-axis") || "Y",
      strength:
        options.strength !== undefined
          ? options.strength
          : parseFloat(element.getAttribute("data-ks-strength") || "10"),
    };

    // Set transformType, axis, and strength
    this.isActive = this.options.active!;
    this.transformType = this.options.transformType!;
    this.axis = parseAxes(
      this.options.axis! || (this.transformType === "rotate" ? "Z" : "X, Y")
    );
    this.strength = this.options.strength!;

    const computedStyle = window.getComputedStyle(this.element);
    this.initialTransform =
      computedStyle.transform === "none" ? "" : computedStyle.transform;

    this.init();
  }

  init() {
    this.element.style.transition = `transform ${this.options.duration}ms ${this.options.easing}`;
    if (this.isActive) {
      this.setupScrollInteraction();
    }
  }

  setupScrollInteraction() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startScrollAnimation();
          } else {
            this.resetTransform();
          }
        });
      },
      {
        threshold: 0,
      }
    );

    this.observer.observe(this.element);
  }

  startScrollAnimation() {
    window.addEventListener("scroll", this.onScroll);
    this.onScroll();
  }

  onScroll = () => {
    const rect = this.element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const scrollProgress = clamp(
      (windowHeight - rect.top) / (windowHeight + rect.height),
      0,
      1
    );

    this.applyTransform(scrollProgress);
  };

  applyTransform(progress: number) {
    let transformValue = "";

    const { strength, transformType, axis } = this;
    const value = progress * strength;

    switch (transformType) {
      case "translate": {
        const translateX = axis.includes("X") ? value : 0;
        const translateY = axis.includes("Y") ? value : 0;
        const translateZ = axis.includes("Z") ? value : 0;
        transformValue = `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`;
        break;
      }
      case "rotate": {
        // Use rotate3d to handle rotation on all axes
        const rotateX = axis.includes("X") ? value : 0;
        const rotateY = axis.includes("Y") ? value : 0;
        const rotateZ = axis.includes("Z") ? value : 0;

        transformValue = `rotate3d(${rotateX !== 0 ? 1 : 0}, ${
          rotateY !== 0 ? 1 : 0
        }, ${rotateZ !== 0 ? 1 : 0}, ${rotateX || rotateY || rotateZ}deg)`;
        break;
      }
      case "scale": {
        const scaleX = axis.includes("X") ? 1 + value * 0.01 : 1;
        const scaleY = axis.includes("Y") ? 1 + value * 0.01 : 1;
        const scaleZ = axis.includes("Z") ? 1 + value * 0.01 : 1;
        transformValue = `scale3d(${scaleX}, ${scaleY}, ${scaleZ})`;
        break;
      }
    }

    this.element.style.transform =
      `${this.initialTransform} ${transformValue}`.trim();
  }

  resetTransform() {
    this.element.style.transform = this.initialTransform;
    window.removeEventListener("scroll", this.onScroll);
  }
}

export default KinesisScrollItem;
