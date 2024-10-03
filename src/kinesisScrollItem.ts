import {
  KinesisScrollItemOptions,
  TransformAxisType,
  TransformType,
} from "./types";
import { parseTransformAxes, clamp, throttle } from "./utils";

class KinesisScrollItem {
  element: HTMLElement;
  options: KinesisScrollItemOptions;
  isActive: boolean;
  initialTransform: string;
  transformType: TransformType;
  transformAxis: TransformAxisType[];
  strength: number;
  observer: IntersectionObserver | null = null;
  throttleDuration: number;

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
      transformAxis:
        options.transformAxis || element.getAttribute("data-ks-transformAxis"),
      strength:
        options.strength !== undefined
          ? options.strength
          : parseFloat(element.getAttribute("data-ks-strength") || "10"),
    };

    this.throttleDuration = parseInt(
      element.getAttribute("data-ks-throttle") || "100",
      10
    );

    this.isActive = this.options.active!;
    this.transformType = this.options.transformType!;
    this.transformAxis = parseTransformAxes(
      this.options.transformAxis! ||
        (this.transformType === "rotate" ? "Z" : "X, Y")
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
    window.addEventListener("scroll", throttle(this.onScroll));
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

    const { strength, transformType, transformAxis } = this;
    const value = progress * strength;

    switch (transformType) {
      case "translate": {
        const translateX = transformAxis.includes("X") ? value : 0;
        const translateY = transformAxis.includes("Y") ? value : 0;
        const translateZ = transformAxis.includes("Z") ? value : 0;
        transformValue = `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`;
        break;
      }
      case "rotate": {
        const rotateX = transformAxis.includes("X") ? value : 0;
        const rotateY = transformAxis.includes("Y") ? value : 0;
        const rotateZ = transformAxis.includes("Z") ? value : 0;

        transformValue = `rotate3d(${rotateX !== 0 ? 1 : 0}, ${
          rotateY !== 0 ? 1 : 0
        }, ${rotateZ !== 0 ? 1 : 0}, ${rotateX || rotateY || rotateZ}deg)`;
        break;
      }
      case "scale": {
        const scaleX = transformAxis.includes("X") ? 1 + value * 0.01 : 1;
        const scaleY = transformAxis.includes("Y") ? 1 + value * 0.01 : 1;
        const scaleZ = transformAxis.includes("Z") ? 1 + value * 0.01 : 1;
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
