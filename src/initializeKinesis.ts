import KinesisTransformer from "./kinesisTransformer";
import KinesisDepth from "./kinesisDepth";
import KinesisAudio from "./kinesisAudio";
import KinesisScrollItem from "./kinesisScrollItem";
import KinesisPath from "./kinesisPath";
import KinesisDistanceItem from "./kinesisDistanceItem";
import {
  KinesisTransformerOptions,
  KinesisDepthOptions,
  KinesisAudioOptions,
  KinesisScrollItemOptions,
  KinesisPathOptions,
  KinesisDistanceItemOptions,
  TransformType,
} from "./types";

function parseBooleanAttribute(
  element: HTMLElement,
  attribute: string,
  defaultValue: boolean
): boolean {
  const value = element.getAttribute(attribute);
  return value !== null ? value !== "false" : defaultValue;
}

function parseIntAttribute(
  element: HTMLElement,
  attribute: string,
  defaultValue: number
): number {
  const value = parseInt(element.getAttribute(attribute) || "", 10);
  return isNaN(value) ? defaultValue : value;
}

function parseFloatAttribute(
  element: HTMLElement,
  attribute: string,
  defaultValue: number
): number {
  const value = parseFloat(element.getAttribute(attribute) || "");
  return isNaN(value) ? defaultValue : value;
}

function parseStringAttribute(
  element: HTMLElement,
  attribute: string,
  defaultValue: string
): string {
  const value = element.getAttribute(attribute);
  return value !== null ? value : defaultValue;
}

function parseEnumAttribute<T>(
  element: HTMLElement,
  attribute: string,
  validValues: T[],
  defaultValue: T
): T {
  const value = element.getAttribute(attribute) as T;
  return validValues.includes(value) ? value : defaultValue;
}

function initializeKinesis() {
  const transformTypes: TransformType[] = [
    "translate",
    "rotate",
    "scale",
    "tilt",
    "tilt_inv",
  ];

  function initializeComponent<TOptions>(
    selector: string,
    optionsParser: (element: HTMLElement) => TOptions,
    ComponentClass: new (element: HTMLElement, options: TOptions) => any
  ) {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    elements.forEach((element) => {
      if (!element.hasAttribute("data-ks-initialized")) {
        try {
          const options = optionsParser(element);
          new ComponentClass(element, options);
          element.setAttribute("data-ks-initialized", "true");
        } catch (error) {
          console.error(
            `Failed to initialize component for element:`,
            element,
            error
          );
        }
      }
    });
  }

  function initializeUninitializedElements() {
    initializeComponent<KinesisTransformerOptions>(
      "[data-kinesistransformer]",
      (element) => ({
        active: parseBooleanAttribute(element, "data-ks-active", true),
        duration: parseIntAttribute(element, "data-ks-duration", 1000),
        easing: parseStringAttribute(
          element,
          "data-ks-easing",
          "cubic-bezier(0.23, 1, 0.32, 1)"
        ),
        interaction: parseEnumAttribute(
          element,
          "data-ks-interaction",
          ["mouse", "scroll"],
          "mouse"
        ),
      }),
      KinesisTransformer
    );

    initializeComponent<KinesisDepthOptions>(
      "[data-kinesisdepth]",
      (element) => ({
        active: parseBooleanAttribute(element, "data-ks-active", true),
        duration: parseIntAttribute(element, "data-ks-duration", 1000),
        easing: parseStringAttribute(
          element,
          "data-ks-easing",
          "cubic-bezier(0.23, 1, 0.32, 1)"
        ),
        perspective: parseIntAttribute(element, "data-ks-perspective", 1000),
        sensitivity: parseFloatAttribute(element, "data-ks-sensitivity", 40),
        inverted: parseBooleanAttribute(element, "data-ks-invert", false),
      }),
      KinesisDepth
    );

    initializeComponent<KinesisAudioOptions>(
      "[data-kinesisaudio]",
      (element) => ({
        active: parseBooleanAttribute(element, "data-ks-active", true),
        duration: parseIntAttribute(element, "data-ks-duration", 1000),
        easing: parseStringAttribute(
          element,
          "data-ks-easing",
          "cubic-bezier(0.23, 1, 0.32, 1)"
        ),
        tag: parseStringAttribute(element, "data-ks-tag", "div"),
        perspective: parseIntAttribute(element, "data-ks-perspective", 1000),
        audio: parseStringAttribute(element, "data-ks-audio", ""),
        playAudio: parseBooleanAttribute(element, "data-ks-playaudio", false),
        axis: parseStringAttribute(element, "data-ks-axis", "X, Y"),
      }),
      KinesisAudio
    );

    initializeComponent<KinesisScrollItemOptions>(
      "[data-kinesisscroll-item]",
      (element) => ({
        active: parseBooleanAttribute(element, "data-ks-active", true),
        duration: parseIntAttribute(element, "data-ks-duration", 1000),
        easing: parseStringAttribute(
          element,
          "data-ks-easing",
          "cubic-bezier(0.23, 1, 0.32, 1)"
        ),
        transformType: parseEnumAttribute(
          element,
          "data-ks-transform",
          transformTypes,
          "translate"
        ),
        strength: parseFloatAttribute(element, "data-ks-strength", 10),
      }),
      KinesisScrollItem
    );

    initializeComponent<KinesisPathOptions>(
      "[data-kinesispath]",
      (element) => ({
        active: parseBooleanAttribute(element, "data-ks-active", true),
        duration: parseIntAttribute(element, "data-ks-duration", 1000),
        easing: parseStringAttribute(element, "data-ks-easing", "ease"),
        path: parseStringAttribute(element, "data-ks-path", ""),
        interaction: parseEnumAttribute(
          element,
          "data-ks-interaction",
          ["mouse", "scroll"],
          "mouse"
        ),
      }),
      KinesisPath
    );

    initializeComponent<KinesisDistanceItemOptions>(
      "[data-kinesisdistance-item]",
      (element) => ({
        active: parseBooleanAttribute(element, "data-ks-active", true),
        strength: parseFloatAttribute(element, "data-ks-strength", 20),
        transformOrigin: parseStringAttribute(
          element,
          "data-ks-transformorigin",
          "center"
        ),
        startDistance: parseIntAttribute(element, "data-ks-startdistance", 100),
        transformType: parseEnumAttribute(
          element,
          "data-ks-transform",
          transformTypes,
          "translate"
        ),
        duration: parseIntAttribute(element, "data-ks-duration", 1000),
        easing: parseStringAttribute(
          element,
          "data-ks-easing",
          "cubic-bezier(0.23, 1, 0.32, 1)"
        ),
      }),
      KinesisDistanceItem
    );
  }

  initializeUninitializedElements();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        const selectors = [
          "[data-kinesistransformer]",
          "[data-kinesisdepth]",
          "[data-kinesisaudio]",
          "[data-kinesisscroll-item]",
          "[data-kinesispath]",
          "[data-kinesisdistance-item]",
        ];
        if (selectors.some((selector) => node.matches(selector))) {
          initializeUninitializedElements();
        } else {
          const childElements = node.querySelectorAll(selectors.join(", "));
          if (childElements.length > 0) {
            initializeUninitializedElements();
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export default initializeKinesis;
