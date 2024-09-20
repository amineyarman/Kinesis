import { KinesisTransformerOptions, TransformType } from "./types";
import KinesisTransformerElement from "./kinesisTransformerElement";
import { getMousePosition, clamp, throttle } from "./utils";

class KinesisTransformer {
  container: HTMLElement;
  elements: KinesisTransformerElement[] = [];
  options: KinesisTransformerOptions;
  isActive: boolean;
  initialTransform: string;
  interaction: "mouse" | "scroll";
  observer: IntersectionObserver | null = null;
  perspective: string;
  throttleDuration: number;

  constructor(container: HTMLElement, options: KinesisTransformerOptions = {}) {
    if (!container.hasAttribute("data-kinesistransformer")) {
      throw new Error(
        "Container does not have the 'data-kinesistransformer' attribute."
      );
    }

    this.container = container;

    // Reading data-ks-perspective or defaulting to '1000px'
    this.perspective =
      container.getAttribute("data-ks-perspective") || "1000px";

    // Reading throttle duration from data-ks-throttle or default to 100ms
    this.throttleDuration = parseInt(
      container.getAttribute("data-ks-throttle") || "100",
      10
    );

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
    const children = this.container.querySelectorAll(
      "[data-kinesistransformer-element]"
    ) as NodeListOf<HTMLElement>;

    children.forEach((child) => {
      const kinesisElement = new KinesisTransformerElement(child);
      child.style.transition = `transform ${this.options.duration}ms ${this.options.easing}`;
      this.elements.push(kinesisElement);
    });

    const usesZAxis = this.elements.some((el) => el.axis.includes("Z"));

    // Set perspective if elements use Z axis or if the perspective is explicitly set
    if (usesZAxis || this.perspective) {
      this.container.style.perspective = this.perspective;
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
      // Apply throttle to mousemove event
      this.container.addEventListener(
        "mousemove",
        throttle(this.onMouseMove, this.throttleDuration)
      );
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
    // Apply throttle to scroll event
    window.addEventListener(
      "scroll",
      throttle(this.onScroll, this.throttleDuration)
    );
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
