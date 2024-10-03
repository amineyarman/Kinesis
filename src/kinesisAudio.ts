// kinesisAudio.ts

import { KinesisAudioOptions } from "./types";
import KinesisAudioElement from "./kinesisAudioElement";
import { throttle } from "./utils";

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
  observer: IntersectionObserver | null = null;
  mutationObserver: MutationObserver | null = null;
  isAnimating: boolean = false;

  private smoothingFactor: number = 0.8;
  private smoothedData: Uint8Array | null = null;

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

    this.setupAudioElement(this.audioSrc);

    this.initIntersectionObserver();
    this.initMutationObserver();

    (this.container as any)._kinesisAudio = this;
  }

  setupAudioElement(src: string) {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.remove();
      this.audioElement = null;
    }

    this.audioElement = document.createElement("audio");
    this.audioElement.src = src;
    this.audioElement.crossOrigin = "anonymous";
    this.audioElement.style.display = "none";
    this.container.appendChild(this.audioElement);

    this.initializeAudioContext();

    if (this.playAudio) {
      this.play();
    }
  }

  initializeAudioContext() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = this.smoothingFactor;

    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
    this.smoothedData = new Uint8Array(bufferLength);
    this.smoothedData.fill(0);

    if (this.audioElement) {
      this.source = this.audioContext.createMediaElementSource(
        this.audioElement
      );
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
    }
  }

  initIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.resume();
          } else {
            this.pause();
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    this.observer.observe(this.container);
  }

  initMutationObserver() {
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "data-ks-playaudio" ||
            mutation.attributeName === "data-ks-audio")
        ) {
          const playAudio =
            this.container.getAttribute("data-ks-playaudio") === "true";
          const newAudioSrc = this.container.getAttribute("data-ks-audio");

          if (mutation.attributeName === "data-ks-playaudio") {
            if (playAudio) {
              this.play();
            } else {
              this.stop();
            }
          }

          if (mutation.attributeName === "data-ks-audio" && newAudioSrc) {
            this.audioSrc = newAudioSrc;
            this.setupAudioElement(this.audioSrc);
          }
        }
      });
    });

    this.mutationObserver.observe(this.container, {
      attributes: true,
      attributeFilter: ["data-ks-playaudio", "data-ks-audio"],
    });
  }

  play() {
    if (this.audioElement) {
      this.audioElement.play();
      this.audioContext?.resume();
      this.resume();
      if (this.smoothedData) {
        this.smoothedData.fill(0);
      }
    }
  }

  resume() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.throttledAnimate();
    }
  }

  pause() {
    if (this.isAnimating) {
      this.isAnimating = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      this.resetTransforms();
    }
  }

  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.pause();
      if (this.smoothedData) {
        this.smoothedData.fill(0);
      }
    }
  }

  animate() {
    if (!this.isAnimating || !this.analyser || !this.dataArray) return;

    this.analyser.getByteFrequencyData(this.dataArray);

    for (let i = 0; i < this.dataArray.length; i++) {
      this.smoothedData![i] =
        this.smoothedData![i] * this.smoothingFactor +
        this.dataArray![i] * (1 - this.smoothingFactor);
    }

    const normalizedData = Array.from(this.smoothedData!).map(
      (value) => value / 255
    );

    this.elements.forEach((element) => {
      const frequencyValue = normalizedData[element.audioIndex];
      element.applyTransform(frequencyValue);
    });

    this.animationId = requestAnimationFrame(this.throttledAnimate);
  }

  resetTransforms() {
    this.elements.forEach((element) => {
      element.resetTransform();
    });
  }

  destroy() {
    this.observer?.disconnect();
    this.mutationObserver?.disconnect();
    this.audioElement?.pause();
    this.audioElement?.remove();
    this.source?.disconnect();
    this.analyser?.disconnect();
    this.audioContext?.close();
  }
}

export default KinesisAudio;
