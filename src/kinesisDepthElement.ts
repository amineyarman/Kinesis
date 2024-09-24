class KinesisDepthElement {
  element: HTMLElement;
  depth: number;
  initialTransform: string;

  constructor(element: HTMLElement) {
    if (!element.hasAttribute("data-kinesisdepth-element")) {
      throw new Error(
        "Element does not have the 'data-kinesisdepth-element' attribute."
      );
    }

    this.element = element;
    this.depth = parseFloat(element.getAttribute("data-ks-depth") || "10");

    const computedStyle = window.getComputedStyle(this.element);
    this.initialTransform =
      computedStyle.transform === "none" ? "" : computedStyle.transform;

    // Initially, set the element at Z=0
    this.element.style.transform = `${this.initialTransform} translateZ(0px)`;
    this.element.style.transition = `transform 1s cubic-bezier(0.23, 1, 0.32, 1)`;
  }

  applyDepth(newDepth: number) {
    // When hovered, apply the depth defined by the user
    this.element.style.transform = `${this.initialTransform} translateZ(${newDepth}px)`;
  }

  resetDepth() {
    // On mouse leave, return to Z=0
    this.element.style.transform = `${this.initialTransform} translateZ(0px)`;
  }
}

export default KinesisDepthElement;
