class KinesisPathElement {
  element: HTMLElement;
  strength: number;
  initialOffset: number;
  pathLength: number;
  transitionDuration: number;
  pathData: string;

  constructor(element: HTMLElement, pathData: string, pathLength: number) {
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
    this.pathData = pathData;
    this.pathLength = pathLength;

    this.element.style.offsetPath = `path('${this.pathData}')`;
    this.element.style.offsetDistance = `${this.initialOffset}%`;

    this.transitionDuration = parseInt(
      element.getAttribute("data-ks-duration") || "1000",
      10
    );
    const easing =
      element.getAttribute("data-ks-easing") ||
      "cubic-bezier(0.23, 1, 0.32, 1)";
    this.element.style.transition = `offset-distance ${this.transitionDuration}ms ${easing}`;
  }

  updatePosition(progress: number) {
    const scaledProgress = progress * this.strength;
    const offset = (this.initialOffset + scaledProgress * 100) % 100;
    this.element.style.offsetDistance = `${offset}%`;
  }

  resetPosition(throttleDuration: number) {
    // const totalDelay = throttleDuration + this.transitionDuration;

    const totalDelay = throttleDuration;
    setTimeout(() => {
      this.element.style.offsetDistance = `${this.initialOffset}%`;
    }, totalDelay);
  }
}

export default KinesisPathElement;
