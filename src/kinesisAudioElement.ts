// kinesisAudioElement.ts

import { TransformType } from "./types";

class KinesisAudioElement {
  element: HTMLElement;
  audioIndex: number;
  strength: number;
  type: TransformType;
  transformOrigin: string;
  initialTransform: string;

  // Track the previous value to determine if the frequency is increasing or decreasing
  private previousValue: number = 0;

  constructor(element: HTMLElement) {
    if (!element.hasAttribute("data-kinesisaudio-element")) {
      throw new Error(
        "Element does not have the 'data-kinesisaudio-element' attribute."
      );
    }

    this.element = element;
    this.audioIndex = parseInt(
      element.getAttribute("data-ks-audioindex") || "50"
    );
    this.strength = parseFloat(
      element.getAttribute("data-ks-strength") || "10"
    );
    this.type =
      (element.getAttribute("data-ks-type") as TransformType) || "translate";
    this.transformOrigin =
      element.getAttribute("data-ks-transformorigin") || "center";

    const computedStyle = window.getComputedStyle(this.element);
    this.initialTransform =
      computedStyle.transform === "none" ? "" : computedStyle.transform;

    this.element.style.transformOrigin = this.transformOrigin;
    this.element.style.transform = this.initialTransform;

    // Initialize CSS variables for dynamic transition durations
    this.element.style.setProperty("--transform-duration", "0.1s");
    this.element.style.transition = `transform var(--transform-duration) ease-out`;
  }

  applyTransform(value: number) {
    let transformValue = "";

    const { strength, type } = this;

    switch (type) {
      case "translate": {
        const translateX = value * strength;
        const translateY = value * strength;
        transformValue = `translate(${translateX}px, ${translateY}px)`;
        break;
      }
      case "rotate": {
        const rotate = value * strength;
        transformValue = `rotate(${rotate}deg)`;
        break;
      }
      case "scale": {
        const scale = 1 + value * strength * 0.1;
        transformValue = `scale(${scale})`;
        break;
      }
    }

    // Determine if the frequency is increasing or decreasing
    const isRising = value > this.previousValue;

    // Set transition duration based on the frequency change
    if (isRising) {
      // Quick rise
      this.element.style.setProperty("--transform-duration", "0.05s");
    } else {
      // Slow decay
      this.element.style.setProperty("--transform-duration", "0.3s");
    }

    // Update the transform
    this.element.style.transform =
      `${this.initialTransform} ${transformValue}`.trim();

    // Update the previous value
    this.previousValue = value;
  }

  resetTransform() {
    this.element.style.setProperty("--transform-duration", "0.5s"); // Slow reset
    this.element.style.transform = this.initialTransform;
    this.previousValue = 0;
  }
}

export default KinesisAudioElement;
