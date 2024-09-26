import { KinesisPathOptions } from "./types";
import KinesisPathElement from "./kinesisPathElement";
import { clamp, getMousePosition, throttle } from "./utils";

class KinesisPath {
  container: HTMLElement;
  elements: KinesisPathElement[] = [];
  options: Required<KinesisPathOptions>;
  isActive: boolean;
  interaction: "mouse" | "scroll";
  throttleDuration: number;
  globalPath: string;
  globalPathLength: number;

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
        parseInt(container.getAttribute("data-ks-duration") || "800", 10),
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

    this.isActive = this.options.active;
    this.interaction = this.options.interaction;

    if (!this.options.path) {
      throw new Error("No global path data provided for KinesisPath.");
    }

    this.globalPath = this.options.path;
    this.globalPathLength = this.calculatePathLength(this.globalPath);

    this.init();
  }

  init() {
    console.log("initPath Individual 2");
    const children = this.container.querySelectorAll(
      "[data-kinesispath-element]"
    ) as NodeListOf<HTMLElement>;

    children.forEach((child) => {
      // Check if the child has its own data-ks-path attribute
      const elementPath = child.getAttribute("data-ks-path") || this.globalPath;

      if (!elementPath) {
        throw new Error(
          "No path data provided for KinesisPathElement. Please provide a global path or a specific path for the element."
        );
      }

      const elementPathLength = this.calculatePathLength(elementPath);

      const pathElement = new KinesisPathElement(
        child,
        elementPath,
        elementPathLength
      );
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
    this.container.addEventListener("mousemove", throttle(this.onMouseMove));
    this.container.addEventListener("mouseleave", this.onMouseLeave);
  }

  onMouseMove = (event: MouseEvent) => {
    console.log("move");
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
    window.addEventListener("scroll", throttle(this.onScroll));
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
