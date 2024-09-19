class KinesisPathElement {
  element: HTMLElement;
  strength: number;
  initialOffset: number;
  pathLength: number;

  constructor(element: HTMLElement, pathLength: number) {
    if (!element.hasAttribute("data-kinesispath-element")) {
      throw new Error(
        "Element does not have the 'data-kinesispath-element' attribute."
      );
    }

    this.element = element;
    this.strength = parseFloat(element.getAttribute("data-ks-strength") || "1");
    this.initialOffset = parseFloat(
      element.getAttribute("data-ks-offset") || "0"
    );
    this.pathLength = pathLength;

    const parentElement = this.element.parentElement as HTMLElement;
    const pathData = parentElement.getAttribute("data-ks-path") || "";

    this.element.style.offsetPath = `path('${pathData}')`;
    this.element.style.offsetDistance = `${this.initialOffset}%`;
    this.element.style.transition = `offset-distance ${
      parentElement.getAttribute("data-ks-duration") || "1000"
    }ms ${parentElement.getAttribute("data-ks-easing") || "ease"}`;
  }

  updatePosition(progress: number) {
    const offset = (this.initialOffset + progress * this.strength * 100) % 100;
    this.element.style.offsetDistance = `${offset}%`;
  }

  resetPosition() {
    this.element.style.offsetDistance = `${this.initialOffset}%`;
  }
}

export default KinesisPathElement;
