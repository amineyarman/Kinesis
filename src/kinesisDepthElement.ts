class KinesisDepthElement {
  element: HTMLElement;
  depth: number;
  initialTransform: string;

  constructor(element: HTMLElement) {
    if (!element.hasAttribute("data-depth-element")) {
      throw new Error(
        "Element does not have the 'data-depth-element' attribute."
      );
    }

    this.element = element;
    this.depth = parseFloat(element.getAttribute("data-depth") || "10");

    const computedStyle = window.getComputedStyle(this.element);
    this.initialTransform =
      computedStyle.transform === "none" ? "" : computedStyle.transform;

    this.element.style.transform = `${this.initialTransform} translateZ(${this.depth}px)`;
    this.element.style.transition = `transform 1s cubic-bezier(0.23, 1, 0.32, 1)`;
  }

  applyDepth(newDepth: number) {
    this.element.style.transform = `${this.initialTransform} translateZ(${newDepth}px)`;
  }

  resetDepth() {
    this.element.style.transform = `${this.initialTransform} translateZ(${this.depth}px)`;
  }
}

export default KinesisDepthElement;
