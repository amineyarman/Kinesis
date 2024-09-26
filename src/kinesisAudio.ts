// kinesisAudio.ts

import { KinesisAudioOptions } from "./types";
import KinesisAudioElement from "./kinesisAudioElement";
import { throttle } from "./utils"; // Import the throttle function

class KinesisAudio {
  container: HTMLElement;
  elements: KinesisAudioElement[] = [];
  options: Required<KinesisAudioOptions>;
  isActive: boolean;
  initialTransform: string;
  perspective: number;
  audioSrc: string;
  playAudio: boolean;
  audioContext: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  dataArray: Uint8Array | null = null;
  source: MediaElementAudioSourceNode | null = null;
  audioElement: HTMLAudioElement | null = null;
  animationId: number | null = null;
  observer: IntersectionObserver | null = null; // Intersection Observer to observe visibility
  isAnimating: boolean = false; // Track whether animation is active

  // Smoothing parameters
  private smoothingFactor: number = 0.8; // Adjust between 0 (no smoothing) and 1 (max smoothing)
  private smoothedData: Uint8Array | null = null;

  // Throttled animation step
  private throttledAnimate: () => void;

  constructor(container: HTMLElement, options: KinesisAudioOptions) {
    if (!container.hasAttribute("data-kinesisaudio")) {
      throw new Error(
        "Container does not have the 'data-kinesisaudio' attribute."
      );
    }

    this.container = container;

    this.options = {
      active: options.active ?? true,
      duration: options.duration ?? 1000,
      easing: options.easing ?? "cubic-bezier(0.23, 1, 0.32, 1)",
      tag: options.tag ?? "div",
      perspective: options.perspective ?? 1000,
      audio: options.audio,
      playAudio: options.playAudio ?? false,
    } as Required<KinesisAudioOptions>;

    this.isActive = this.options.active;
    this.perspective = this.options.perspective;
    this.audioSrc = this.options.audio;
    this.playAudio = this.options.playAudio;

    const computedStyle = window.getComputedStyle(this.container);
    this.initialTransform =
      computedStyle.transform === "none" ? "" : computedStyle.transform;

    // Initialize throttled animate function
    this.throttledAnimate = throttle(this.animate.bind(this));

    this.init();
  }

  init() {
    const children = this.container.querySelectorAll(
      "[data-kinesisaudio-element]"
    ) as NodeListOf<HTMLElement>;

    children.forEach((child) => {
      const audioElement = new KinesisAudioElement(child);
      this.elements.push(audioElement);
    });

    this.container.style.perspective = `${this.perspective}px`;
    this.container.style.transformStyle = "preserve-3d";
    this.container.style.position = "relative";

    this.audioElement = document.createElement("audio");
    this.audioElement.src = this.audioSrc;
    this.audioElement.crossOrigin = "anonymous";
    this.audioElement.style.display = "none";
    this.container.appendChild(this.audioElement);

    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = this.smoothingFactor; // Apply smoothing

    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
    this.smoothedData = new Uint8Array(bufferLength);

    this.source = this.audioContext.createMediaElementSource(this.audioElement);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    if (this.playAudio) {
      this.play();
    }

    // Initialize the Intersection Observer
    this.initObserver();

    (this.container as any)._kinesisAudio = this;
  }

  /**
   * Initializes the Intersection Observer to monitor whether the container
   * is within the viewport.
   */
  initObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("in");
            this.resume(); // Start or resume animation when visible
          } else {
            console.log("out");
            this.pause(); // Stop animation when not visible
          }
        });
      },
      {
        root: null, // Observe relative to the viewport
        threshold: 0.1, // Trigger when at least 10% of the element is visible
      }
    );

    this.observer.observe(this.container);
  }

  play() {
    if (this.audioElement) {
      this.audioElement.play();
      this.audioContext?.resume();
      this.resume(); // Ensure animation resumes when play is called
    }
  }

  /**
   * Resumes the animation when the container becomes visible.
   */
  resume() {
    if (!this.isAnimating) {
      this.isAnimating = true; // Mark that animation is active
      this.throttledAnimate(); // Start throttled animation
    }
  }

  /**
   * Pauses the animation and stops audio processing when the container is not visible.
   */
  pause() {
    if (this.isAnimating) {
      this.isAnimating = false; // Mark that animation is inactive
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null; // Stop the animation loop
      }
      this.resetTransforms(); // Optionally reset transforms when paused
    }
  }

  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.pause(); // Stop the animation and reset
    }
  }

  animate() {
    // Ensure we only animate if we're supposed to (i.e., isAnimating is true)
    if (!this.isAnimating) return;

    // Use non-null assertions
    this.analyser!.getByteFrequencyData(this.dataArray!);

    // Apply smoothing manually
    for (let i = 0; i < this.dataArray!.length; i++) {
      this.smoothedData![i] =
        this.smoothedData![i] * this.smoothingFactor +
        this.dataArray![i] * (1 - this.smoothingFactor);
    }

    // Normalize the smoothed data
    const normalizedData = Array.from(this.smoothedData!).map(
      (value) => value / 255
    );

    // Apply transforms to elements
    this.elements.forEach((element) => {
      const frequencyValue = normalizedData[element.audioIndex];
      element.applyTransform(frequencyValue);
    });

    // Throttle the next animation frame
    this.animationId = requestAnimationFrame(this.throttledAnimate);
  }

  resetTransforms() {
    this.elements.forEach((element) => {
      element.resetTransform();
    });
  }
}

export default KinesisAudio;
