import KinesisTransformer from "./kinesisTransformer";
import KinesisDepth from "./kinesisDepth";
import KinesisAudio from "./kinesisAudio";
import KinesisScrollItem from "./kinesisScrollItem";
import KinesisPath from "./kinesisPath";
import KinesisDistanceItem from "./kinesisDistanceItem"; // Import the new class
import {
  KinesisTransformerOptions,
  KinesisDepthOptions,
  KinesisAudioOptions,
  KinesisScrollItemOptions,
  KinesisPathOptions,
  KinesisDistanceItemOptions,
  VelocityType,
  TransformType,
} from "./types";

function initializeKinesis() {
  // Initialize KinesisTransformer
  const transformerElements = document.querySelectorAll<HTMLElement>(
    "[data-kinesistransformer]"
  );
  transformerElements.forEach((element) => {
    const options: KinesisTransformerOptions = {
      active: element.getAttribute("data-ks-active") !== "false",
      duration: parseInt(
        element.getAttribute("data-ks-duration") || "1000",
        10
      ),
      easing:
        element.getAttribute("data-ks-easing") ||
        "cubic-bezier(0.23, 1, 0.32, 1)",
      interaction:
        element.getAttribute("data-ks-interaction") === "scroll"
          ? "scroll"
          : "mouse",
    };

    new KinesisTransformer(element, options);
  });

  // Initialize KinesisDepth
  const depthElements = document.querySelectorAll<HTMLElement>(
    "[data-kinesisdepth]"
  );
  depthElements.forEach((element) => {
    const options: KinesisDepthOptions = {
      active: element.getAttribute("data-ks-active") !== "false",
      duration: parseInt(
        element.getAttribute("data-ks-duration") || "1000",
        10
      ),
      easing:
        element.getAttribute("data-ks-easing") ||
        "cubic-bezier(0.23, 1, 0.32, 1)",
      perspective: parseInt(
        element.getAttribute("data-ks-perspective") || "1000",
        10
      ),
      sensitivity: parseFloat(
        element.getAttribute("data-ks-sensitivity") || "100"
      ),
      inverted: element.getAttribute("data-ks-invert") === "true",
    };

    new KinesisDepth(element, options);
  });

  // Initialize KinesisAudio
  const audioElements = document.querySelectorAll<HTMLElement>(
    "[data-kinesisaudio]"
  );
  audioElements.forEach((element) => {
    const options: KinesisAudioOptions = {
      active: element.getAttribute("data-ks-active") !== "false",
      duration: parseInt(
        element.getAttribute("data-ks-duration") || "1000",
        10
      ),
      easing:
        element.getAttribute("data-ks-easing") ||
        "cubic-bezier(0.23, 1, 0.32, 1)",
      tag: element.getAttribute("data-ks-tag") || "div",
      perspective: parseInt(
        element.getAttribute("data-ks-perspective") || "1000",
        10
      ),
      audio: element.getAttribute("data-ks-audio") || "",
      playAudio: element.getAttribute("data-ks-playaudio") === "true",
      axis: element.getAttribute("data-ks-axis") || "X, Y",
    };

    new KinesisAudio(element, options);
  });

  // Initialize KinesisScrollItem
  const scrollItems = document.querySelectorAll<HTMLElement>(
    "[data-kinesisscroll-item]"
  );
  scrollItems.forEach((element) => {
    const options: KinesisScrollItemOptions = {
      active: element.getAttribute("data-ks-active") !== "false",
      duration: parseInt(
        element.getAttribute("data-ks-duration") || "1000",
        10
      ),
      easing:
        element.getAttribute("data-ks-easing") ||
        "cubic-bezier(0.23, 1, 0.32, 1)",
      transformType:
        (element.getAttribute("data-ks-transform") as TransformType) ||
        "translate",
      axis: element.getAttribute("data-ks-axis") || "Y",
      strength: parseFloat(element.getAttribute("data-ks-strength") || "10"),
    };

    new KinesisScrollItem(element, options);
  });

  // Initialize KinesisPath
  const pathElements =
    document.querySelectorAll<HTMLElement>("[data-kinesispath]");
  pathElements.forEach((element) => {
    const options: KinesisPathOptions = {
      active: element.getAttribute("data-ks-active") !== "false",
      duration: parseInt(
        element.getAttribute("data-ks-duration") || "1000",
        10
      ),
      easing: element.getAttribute("data-ks-easing") || "ease",
      path: element.getAttribute("data-ks-path") || "",
      interaction:
        element.getAttribute("data-ks-interaction") === "scroll"
          ? "scroll"
          : "mouse",
    };

    new KinesisPath(element, options);
  });

  // Initialize KinesisDistanceItem
  const distanceItems = document.querySelectorAll<HTMLElement>(
    "[data-kinesisdistance-item]"
  );
  distanceItems.forEach((element) => {
    const options: KinesisDistanceItemOptions = {
      active: element.getAttribute("data-ks-active") !== "false",
      strength: parseFloat(element.getAttribute("data-ks-strength") || "20"),
      transformOrigin:
        element.getAttribute("data-ks-transformorigin") || "center",
      startDistance: parseInt(
        element.getAttribute("data-ks-startdistance") || "100",
        10
      ),
      velocity:
        (element.getAttribute("data-ks-velocity") as VelocityType) || "linear",
      transformType:
        (element.getAttribute("data-ks-transform") as TransformType) ||
        "translate",
    };

    new KinesisDistanceItem(element, options);
  });
}

export default initializeKinesis;
