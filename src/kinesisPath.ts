import { KinesisPathOptions } from "./types";
import KinesisPathElement from "./kinesisPathElement";
import { clamp, getMousePosition, throttle } from "./utils";

class KinesisPath {
  container: HTMLElement;
  elements: KinesisPathElement[] = [];
  options: Required<KinesisPathOptions>;
  isActive: boolean;
  interaction: "mouse" | "scroll";
  pathLength: number;
  throttleDuration: number;

  constructor(container: HTMLElement, options: KinesisPathOptions = {}) {
    if (!container.hasAttribute("data-kinesispath")) {
      throw new Error(
        "Container does not have the 'data-kinesispath' attribute."
      );
    }

    this.container = container;
    this.options = {
      active: options.active !== undefined ? options.active : true,
      duration:
        options.duration ||
        parseInt(container.getAttribute("data-ks-duration") || "800"),
      easing:
        options.easing ||
        container.getAttribute("data-ks-easing") ||
        "cubic-bezier(0.23, 1, 0.32, 1)",
      path: options.path || container.getAttribute("data-ks-path") || "",
      interaction:
        options.interaction ||
        (container.getAttribute("data-ks-interaction") as "mouse" | "scroll") ||
        "mouse",
    };

    this.throttleDuration = parseInt(
      container.getAttribute("data-ks-throttle") || "100",
      10
    );

    this.isActive = this.options.active!;
    this.interaction = this.options.interaction;

    if (!this.options.path) {
      throw new Error("No path data provided for KinesisPath.");
    }

    this.pathLength = this.calculatePathLength(this.options.path);

    this.init();
  }

  init() {
    const children = this.container.querySelectorAll(
      "[data-kinesispath-element]"
    ) as NodeListOf<HTMLElement>;

    children.forEach((child) => {
      const pathElement = new KinesisPathElement(child, this.pathLength);
      this.elements.push(pathElement);
    });

    this.container.style.position = "relative";

    if (this.isActive) {
      if (this.interaction === "mouse") {
        this.bindMoveEvents();
      } else if (this.interaction === "scroll") {
        this.bindScrollEvents();
      }
    }
  }

  calculatePathLength(pathData: string): number {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const tempPath = document.createElementNS(svgNamespace, "path");
    tempPath.setAttribute("d", pathData);
    return tempPath.getTotalLength();
  }

  bindMoveEvents() {
    this.container.addEventListener(
      "mousemove",
      throttle(this.onMouseMove, this.throttleDuration)
    );
    this.container.addEventListener("mouseleave", this.onMouseLeave);
  }

  onMouseMove = (event: MouseEvent) => {
    const pos = getMousePosition(event, this.container);
    const progress = (pos.x + 1) / 2;

    this.elements.forEach((element) => {
      element.updatePosition(progress);
    });
  };

  onMouseLeave = () => {
    this.elements.forEach((element) => {
      element.resetPosition(this.throttleDuration);
    });
  };

  bindScrollEvents() {
    window.addEventListener(
      "scroll",
      throttle(this.onScroll, this.throttleDuration)
    );
    this.onScroll();
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
      element.updatePosition(scrollProgress);
    });
  };
}

export default KinesisPath;
