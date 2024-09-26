import { KinesisTransformerOptions } from "./types";
import KinesisTransformerElement from "./kinesisTransformerElement";
import { getMousePosition, clamp } from "./utils";

class KinesisTransformer {
  container: HTMLElement;
  elements: KinesisTransformerElement[] = [];
  options: KinesisTransformerOptions;
  isActive: boolean = true;
  initialTransform: string = "";
  interaction: "mouse" | "scroll" = "mouse";
  observer: IntersectionObserver | null = null;
  perspective: string = "1000px";
  isMouseInside: boolean = false;
  preserve3d: boolean = true;
  mutationObserver: MutationObserver;

  constructor(container: HTMLElement, options: KinesisTransformerOptions = {}) {
    if (!container.hasAttribute("data-kinesistransformer")) {
      throw new Error(
        "Container does not have the 'data-kinesistransformer' attribute."
      );
    }

    this.container = container;
    this.options = options;

    this.updatePropertiesFromAttributes();

    const computedStyle = window.getComputedStyle(this.container);
    this.initialTransform =
      computedStyle.transform === "none" ? "" : computedStyle.transform;

    this.init();

    this.mutationObserver = new MutationObserver(
      this.handleAttributeChange.bind(this)
    );
    this.mutationObserver.observe(this.container, {
      attributes: true,
      attributeFilter: [
        "data-ks-active",
        "data-ks-duration",
        "data-ks-easing",
        "data-ks-interaction",
        "data-ks-perspective",
        "data-ks-preserve3d",
      ],
    });
  }

  updatePropertiesFromAttributes() {
    const activeAttr = this.container.getAttribute("data-ks-active");
    this.isActive = activeAttr !== "false";

    const interactionAttr = this.container.getAttribute("data-ks-interaction");
    this.interaction = interactionAttr === "scroll" ? "scroll" : "mouse";

    const perspectiveAttr = this.container.getAttribute("data-ks-perspective");
    this.perspective = perspectiveAttr || "1000px";

    const preserve3dAttr = this.container.getAttribute("data-ks-preserve3d");
    this.preserve3d = preserve3dAttr !== "false";

    // Update options
    this.options.duration = parseInt(
      this.container.getAttribute("data-ks-duration") || "1000",
      10
    );
    this.options.easing =
      this.container.getAttribute("data-ks-easing") ||
      "cubic-bezier(0.23, 1, 0.32, 1)";
  }

  handleAttributeChange(mutationsList: MutationRecord[]) {
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes") {
        this.updatePropertiesFromAttributes();
        this.init();
      }
    }
  }

  init() {
    this.destroy();

    const children = this.container.querySelectorAll(
      "[data-kinesistransformer-element]"
    ) as NodeListOf<HTMLElement>;

    children.forEach((child) => {
      const kinesisElement = new KinesisTransformerElement(child);
      child.style.transition = `transform ${this.options.duration}ms ${this.options.easing}`;
      this.elements.push(kinesisElement);
    });

    const usesZAxis = this.elements.some((el) =>
      el.transformAxis.includes("Z")
    );

    if ((usesZAxis || this.perspective) && this.preserve3d) {
      this.container.style.perspective = this.perspective;
      this.container.style.transformStyle = "preserve-3d";
    } else {
      this.container.style.perspective = this.perspective;
    }

    if (this.interaction === "mouse") {
      this.bindMoveEvents();
    } else if (this.interaction === "scroll") {
      this.setupScrollInteraction();
    }
  }

  bindMoveEvents() {
    if (this.isActive) {
      this.container.addEventListener(
        "mousemove",
        this.onMouseMove.bind(this),
        { passive: true }
      );
      this.container.addEventListener(
        "mouseleave",
        this.onMouseLeave.bind(this),
        { passive: true }
      );
      this.container.addEventListener(
        "mouseenter",
        this.onMouseEnter.bind(this),
        { passive: true }
      );
    }
  }

  onMouseEnter() {
    this.isMouseInside = true;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isMouseInside) return;

    const pos = getMousePosition(event, this.container);

    this.elements.forEach((element) => {
      element.applyTransform(pos.x, pos.y);
    });
  }

  onMouseLeave() {
    this.isMouseInside = false;
    this.elements.forEach((element) => {
      element.resetTransform();
    });
  }

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
    window.addEventListener("scroll", this.onScroll.bind(this), {
      passive: true,
    });
    this.onScroll();
  }

  resetScrollAnimation() {
    window.removeEventListener("scroll", this.onScroll.bind(this));
    this.elements.forEach((element) => {
      element.resetTransform();
    });
  }

  onScroll() {
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
  }

  destroy() {
    this.container.removeEventListener(
      "mousemove",
      this.onMouseMove.bind(this)
    );
    this.container.removeEventListener(
      "mouseleave",
      this.onMouseLeave.bind(this)
    );
    this.container.removeEventListener(
      "mouseenter",
      this.onMouseEnter.bind(this)
    );
    window.removeEventListener("scroll", this.onScroll.bind(this));

    this.observer?.disconnect();
    this.mutationObserver?.disconnect();

    this.elements.forEach((element) => {
      element.destroy();
    });
    this.elements = [];
  }
}

export default KinesisTransformer;
