import { KinesisPathOptions } from "./types";
import KinesisPathElement from "./kinesisPathElement";
import { clamp, getMousePosition } from "./utils";

class KinesisPath {
  container: HTMLElement;
  elements: KinesisPathElement[] = [];
  options: Required<KinesisPathOptions>;
  isActive: boolean;
  interaction: "mouse" | "scroll";
  pathLength: number;

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
        parseInt(container.getAttribute("data-ks-duration") || "1000"),
      easing:
        options.easing || container.getAttribute("data-ks-easing") || "ease",
      path: options.path || container.getAttribute("data-ks-path") || "",
      interaction:
        options.interaction ||
        (container.getAttribute("data-ks-interaction") as "mouse" | "scroll") ||
        "mouse",
    };
    this.isActive = this.options.active!;
    this.interaction = this.options.interaction;

    if (!this.options.path) {
      throw new Error("No path data provided for KinesisPath.");
    }

    this.pathLength = this.calculatePathLength(this.options.path);

    this.init();
  }

  init() {
    const children = Array.from(this.container.children) as HTMLElement[];
    children.forEach((child) => {
      if (child.hasAttribute("data-ks-pathelement")) {
        const pathElement = new KinesisPathElement(child, this.pathLength);
        this.elements.push(pathElement);
      }
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
    this.container.addEventListener("mousemove", this.onMouseMove);
    this.container.addEventListener("mouseleave", this.onMouseLeave);
  }

  onMouseMove = (event: MouseEvent) => {
    const pos = getMousePosition(event, this.container);
    const progress = (pos.x + 0.5) / 1;

    this.elements.forEach((element) => {
      element.updatePosition(progress);
    });
  };

  onMouseLeave = () => {
    this.elements.forEach((element) => {
      element.resetPosition();
    });
  };

  bindScrollEvents() {
    window.addEventListener("scroll", this.onScroll);
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
