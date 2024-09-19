class KinesisPathElement {
  element: HTMLElement;
  strength: number;
  initialOffset: number;
  pathLength: number;

  constructor(element: HTMLElement, pathLength: number) {
    if (!element.hasAttribute("data-pathelement")) {
      throw new Error(
        "Element does not have the 'data-pathelement' attribute."
      );
    }

    this.element = element;
    this.strength = parseFloat(element.getAttribute("data-strength") || "1");
    this.initialOffset = parseFloat(element.getAttribute("data-offset") || "0");
    this.pathLength = pathLength;

    const parentElement = this.element.parentElement as HTMLElement;
    const pathData = parentElement.getAttribute("data-path") || "";

    this.element.style.offsetPath = `path('${pathData}')`;
    this.element.style.offsetDistance = `${this.initialOffset}%`;
    this.element.style.transition = `offset-distance ${
      parentElement.getAttribute("data-duration") || "1000"
    }ms ${parentElement.getAttribute("data-easing") || "ease"}`;
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
