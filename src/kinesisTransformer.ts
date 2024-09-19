import { KinesisTransformerOptions, TransformType } from "./types";
import KinesisTransformerElement from "./kinesisTransformerElement";
import { getMousePosition, clamp } from "./utils";

class KinesisTransformer {
  container: HTMLElement;
  elements: KinesisTransformerElement[] = [];
  options: KinesisTransformerOptions;
  isActive: boolean;
  initialTransform: string;
  interaction: "mouse" | "scroll";
  observer: IntersectionObserver | null = null;

  constructor(container: HTMLElement, options: KinesisTransformerOptions = {}) {
    if (!container.hasAttribute("data-kinesistransformer")) {
      throw new Error(
        "Container does not have the 'data-kinesistransformer' attribute."
      );
    }

    this.container = container;
    this.options = {
      active: options.active !== undefined ? options.active : true,
      duration: options.duration || 1000,
      easing: options.easing || "cubic-bezier(0.23, 1, 0.32, 1)",
      interaction: options.interaction || "mouse",
    };
    this.isActive = this.options.active!;
    this.interaction = this.options.interaction as "mouse" | "scroll";

    const computedStyle = window.getComputedStyle(this.container);
    this.initialTransform =
      computedStyle.transform === "none" ? "" : computedStyle.transform;

    this.init();
  }

  init() {
    const children = Array.from(this.container.children) as HTMLElement[];
    children.forEach((child) => {
      if (child.hasAttribute("data-kinesistransformer-element")) {
        const kinesisElement = new KinesisTransformerElement(child);
        child.style.transition = `transform ${this.options.duration}ms ${this.options.easing}`;
        this.elements.push(kinesisElement);
      }
    });

    const usesZAxis = this.elements.some((el) => el.axis.includes("Z"));
    if (usesZAxis) {
      this.container.style.perspective = "1000px";
      this.container.style.transformStyle = "preserve-3d";
    }

    if (this.interaction === "mouse") {
      this.bindMoveEvents();
    } else if (this.interaction === "scroll") {
      this.setupScrollInteraction();
    }
  }

  bindMoveEvents() {
    if (this.isActive) {
      this.container.addEventListener("mousemove", this.onMouseMove);
      this.container.addEventListener("mouseleave", this.onMouseLeave);
    }
  }

  onMouseMove = (event: MouseEvent) => {
    const pos = getMousePosition(event, this.container);

    this.elements.forEach((element) => {
      element.applyTransform(pos.x, pos.y);
    });
  };

  onMouseLeave = () => {
    this.elements.forEach((element) => {
      element.resetTransform();
    });
  };

  setupScrollInteraction() {
    if (!this.isActive) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startScrollAnimation();
          } else {
            this.resetScrollAnimation();
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    this.observer.observe(this.container);
  }

  startScrollAnimation() {
    window.addEventListener("scroll", this.onScroll);
    this.onScroll();
  }

  resetScrollAnimation() {
    window.removeEventListener("scroll", this.onScroll);
    this.elements.forEach((element) => {
      element.resetTransform();
    });
  }

  onScroll = () => {
    const rect = this.container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const scrollProgress = clamp(
      (windowHeight - rect.top) / (windowHeight + rect.height),
      0,
      1
    );

    this.elements.forEach((element) => {
      const x = scrollProgress;
      const y = scrollProgress;
      element.applyTransform(x, y);
    });
  };
}

export default KinesisTransformer;
