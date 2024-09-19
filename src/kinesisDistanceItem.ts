import {
  KinesisDistanceItemOptions,
  VelocityType,
  TransformType,
} from "./types";
import { getMousePositionDistance, clamp } from "./utils";

class KinesisDistanceItem {
  private element: HTMLElement;
  private options: Required<KinesisDistanceItemOptions>;
  private isActive: boolean;
  private initialTransform: string;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private animationId: number | null = null;

  constructor(element: HTMLElement, options: KinesisDistanceItemOptions = {}) {
    if (!element.hasAttribute("data-kinesisdistanceitem")) {
      throw new Error(
        "Element does not have the 'data-kinesisdistanceitem' attribute."
      );
    }

    this.element = element;

    this.options = {
      active: options.active !== undefined ? options.active : true,
      strength: options.strength !== undefined ? options.strength : 20,
      transformOrigin: options.transformOrigin || "center",
      startDistance:
        options.startDistance !== undefined
          ? options.startDistance
          : parseInt(element.getAttribute("data-startdistance") || "100", 10),
      velocity:
        (options.velocity as VelocityType) ||
        (element.getAttribute("data-velocity") as VelocityType) ||
        "linear",
      transformType:
        (options.transformType as TransformType) ||
        (element.getAttribute("data-transform") as TransformType) ||
        "translate",
    } as Required<KinesisDistanceItemOptions>;

    this.isActive = this.options.active;

    const computedStyle = window.getComputedStyle(this.element);
    this.initialTransform =
      computedStyle.transform === "none" ? "" : computedStyle.transform;

    this.element.style.transformOrigin = this.options.transformOrigin;
    this.element.style.transform = this.initialTransform;
    this.element.style.transition = `transform 0.2s ease-out`;

    if (this.isActive) {
      this.bindEvents();
    }
  }

  private bindEvents() {
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("resize", this.onResize);
    this.animate();
  }

  private onMouseMove = (event: MouseEvent) => {
    const pos = getMousePositionDistance(event);
    this.mouseX = pos.x;
    this.mouseY = pos.y;
  };

  private onResize = () => {};

  private calculateDistance(): number {
    const rect = this.element.getBoundingClientRect();
    const elementX = rect.left + rect.width / 2;
    const elementY = rect.top + rect.height / 2;

    const dx = this.mouseX - elementX;
    const dy = this.mouseY - elementY;

    return Math.sqrt(dx * dx + dy * dy);
  }

  private getVelocityFactor(distance: number): number {
    switch (this.options.velocity) {
      case "linear":
        return 1;
      case "acceleration":
        return 1 - clamp(distance / this.options.startDistance, 0, 1);
      case "deceleration":
        return clamp(distance / this.options.startDistance, 0, 1);
      default:
        return 1;
    }
  }

  private applyTransform() {
    const distance = this.calculateDistance();
    if (distance < this.options.startDistance) {
      const factor = this.getVelocityFactor(distance);
      let transformValue = "";

      const { transformType, strength } = this.options;

      switch (transformType) {
        case "translate":
          const translateX =
            (this.mouseX - window.innerWidth / 2) * (strength / 100) * factor;
          const translateY =
            (this.mouseY - window.innerHeight / 2) * (strength / 100) * factor;
          transformValue = `translate(${translateX}px, ${translateY}px)`;
          break;
        case "rotate":
          const rotateAngle = strength * factor;
          transformValue = `rotate(${rotateAngle}deg)`;
          break;
        case "scale":
          const scaleFactor = 1 + (strength / 100) * factor;
          transformValue = `scale(${scaleFactor})`;
          break;
        default:
          break;
      }

      this.element.style.transform =
        `${this.initialTransform} ${transformValue}`.trim();
    } else {
      this.element.style.transform = this.initialTransform;
    }
  }

  private animate() {
    this.applyTransform();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  public destroy() {
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("resize", this.onResize);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

export default KinesisDistanceItem;
