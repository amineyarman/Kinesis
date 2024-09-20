# Kinesis.js

**Author:** Amine Bouyarmane  
**License:** MIT

[Kinesis.js](https://github.com/Aminerman/kinesis.js) is a lightweight, TypeScript-powered library that enables you to create complex and interactive animations with ease. Whether you're looking to add depth effects, audio-reactive elements, scroll-based transformations, or path-following animations, Kinesis.js has you covered.

## Installation

You can install Kinesis.js via npm or yarn:

```bash
npm install @aminerman/kinesis
```

or

```bash
yarn add @aminerman/kinesis
```

## Getting Started

To start using Kinesis.js in your project, initialize it by importing and calling the `initializeKinesis` function. This function scans your DOM for elements with specific `data-ks-*` attributes and initializes the corresponding Kinesis components.

```typescript
import { initializeKinesis } from "@aminerman/kinesis";

document.addEventListener("DOMContentLoaded", () => {
  initializeKinesis();
});
```

## Components

Kinesis.js provides several components to create various interactive animations. Each component targets elements with specific `data-ks-*` attributes and applies transformations based on user interactions or other triggers.

### KinesisTransformer

**Description:**
Applies transformations (`translate`, `rotate`, `scale`, `tilt`) to elements based on mouse movement or scroll interaction.
**Usage:**

```html
<div class="container" data-kinesistransformer data-ks-interaction="mouse">
  <div
    class="transform-element"
    data-kinesistransformer-element
    data-ks-strength="30"
    data-ks-transform="rotate"
    data-ks-axis="Z"
  ></div>
  <!-- More transform elements -->
</div>
```

### KinesisDepth

**Description:**
Creates a parallax depth effect by translating elements along the Z-axis. Then container moves by rotating around the X and Y axis, showcasing the depth effect.
**Usage:**

```html
<div class="container" data-kinesisdepth data-ks-sensitivity="10">
  <div
    class="depth-element"
    data-kinesisdepth-element
    data-ks-depth="-20"
  ></div>
  <!-- More depth elements -->
</div>
```

### KinesisAudio

**Description:**
Applies audio-reactive transformations to elements based on audio frequency data.
**Usage:**

```html
<div
  class="container"
  id="audio"
  data-kinesisaudio
  data-ks-audio="audio.mp3"
  data-ks-playaudio="false"
>
  <div
    class="audio-element"
    data-kinesisaudio-element
    data-ks-audioindex="60"
    data-ks-strength="50"
    data-ks-type="scale"
  ></div>
  <!-- More audio elements -->
  <button id="play-audio">Play Audio</button>
  <button id="stop-audio">Stop Audio</button>
</div>

<script>
  window.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("play-audio");
    const stopButton = document.getElementById("stop-audio");
    const container = document.getElementById("audio");
    const kinesisAudio = container._kinesisAudio;

    if (playButton && kinesisAudio) {
      playButton.addEventListener("click", () => kinesisAudio.play());
    }

    if (stopButton && kinesisAudio) {
      stopButton.addEventListener("click", () => kinesisAudio.stop());
    }
  });
</script>
```

### KinesisScrollItem

**Description:**
Applies transformations to the element based on scroll. This is a standalone component. It doesn't need to be inside KinesisTransformer.
**Usage:**

```html
<div class="scroll-item-container container">
  <div
    class="scroll-item"
    data-kinesisscroll-item
    data-ks-transform="scale"
    data-ks-axis="X, Y"
    data-ks-strength="100"
    style="background-color: lightgreen; width: 50px; height: 50px"
  ></div>
</div>
```

### KinesisPath

**Description:**
Moves elements along a predefined SVG path based on mouse movement or scroll interaction.
**Usage:**

```html
<div
  class="path-container"
  data-kinesispath
  data-ks-path="M 100,300 C 200,100 400,500 500,300"
  data-ks-duration="100"
  data-ks-interaction="scroll"
>
  <!-- Path Elements -->
  <div
    class="path-element"
    data-kinesispath-element
    data-ks-strength="1"
    data-ks-offset="0"
  ></div>
  <div
    class="path-element"
    data-kinesispath-element
    data-ks-strength="0.5"
    data-ks-offset="50"
  ></div>
</div>
```

### KinesisDistanceItem

**Description:**
Transforms elements based on the distance between the mouse pointer and the element.
**Usage:**

```html
<div class="distance-container">
  <div
    class="distance-item"
    data-kinesisdistance-item
    data-ks-transform="rotate"
    data-ks-axis="X, Y"
    data-ks-strength="20"
    data-ks-velocity="deceleration"
  ></div>
  <!-- More distance items -->
</div>
```

## Attributes

### KinesisAudio Attributes

> <span style="color:DodgerBlue">Note: Container for KinesisAudioElement</span>

| Attribute           | Type    | Default Value                  | Description                                     |
| ------------------- | ------- | ------------------------------ | ----------------------------------------------- |
| data-kinesisaudio   | N/A     | N/A                            | Marks the container element for KinesisAudio.   |
| data-ks-active      | boolean | true                           | Enables or disables the audio effect.           |
| data-ks-duration    | number  | 1000                           | Duration of the transformation in milliseconds. |
| data-ks-easing      | string  | cubic-bezier(0.23, 1, 0.32, 1) | Easing function for the transition.             |
| data-ks-tag         | string  | div                            | HTML tag to wrap audio elements.                |
| data-ks-perspective | number  | 1000                           | Perspective distance for 3D transformations.    |
| data-ks-audio       | string  | N/A                            | Path to the audio file.                         |
| data-ks-playaudio   | boolean | false                          | Automatically plays audio on initialization.    |

### KinesisAudioElement Attributes

> <span style="color:DodgerBlue">Note: Child of KinesisAudio container.</span>

| Attribute                | Type   | Default Value | Description                                       |
| ------------------------ | ------ | ------------- | ------------------------------------------------- |
| data-kinesisaudio-element | N/A         | N/A           | Marks an element to be audio-reactive by KinesisAudio. Should be a child of KinesisAudio. |
| data-ks-audioindex        | number      | 50            | Index of the audio frequency to react to.                                                 |
| data-ks-strength          | number      | 10            | Strength of the transformation effect.                                                    |
| data-ks-type              | "translate" | "rotate"      | "scale"                                                                                   | "translate" | Type of transformation to apply based on audio. |
| data-ks-transformorigin   | string      | "center"      | Origin point for transformations.                                                         |

### KinesisDepth Attributes

> <span style="color:DodgerBlue">Note: Container for KinesisDepthElement</span>

| Attribute           | Type    | Default Value                  | Description                                     |
| ------------------- | ------- | ------------------------------ | ----------------------------------------------- |
| data-kinesisdepth   | N/A     | N/A                            | Marks the container element for KinesisDepth.   |
| data-ks-active      | boolean | true                           | Enables or disables the depth effect.           |
| data-ks-duration    | number  | 1000                           | Duration of the transformation in milliseconds. |
| data-ks-easing      | string  | cubic-bezier(0.23, 1, 0.32, 1) | Easing function for the transition.             |
| data-ks-perspective | number  | 1000                           | Perspective distance for 3D transformations.    |
| data-ks-sensitivity | number  | 10                             | Sensitivity of the container's movement.        |
| data-ks-invert      | boolean | false                          | Inverts the container's movement direction.     |

### KinesisDepthElement Attributes

> <span style="color:DodgerBlue">Note: Child of KinesisDepth container.</span>

| Attribute                 | Type   | Default Value | Description                                                        |
| ------------------------- | ------ | ------------- | ------------------------------------------------------------------ |
| data-kinesisdepth-element | N/A    | N/A           | Marks an element to have depth applied by KinesisDepth.            |
| data-ks-depth             | number | N/A           | Depth value for the element. Determines its position on the Z-Axis |

### KinesisDistanceItem Attributes

> <span style="color:DodgerBlue">Note: Standalone component</span>

| Attribute                | Type   | Default Value | Description                                       |
| ------------------------ | ------ | ------------- | ------------------------------------------------- |
| data-kinesisdistance-item | N/A         | N/A                            | Marks an element to transform based on mouse distance. |
| data-ks-active            | boolean     | true                           | Enables or disables the distance item.                 |
| data-ks-duration          | number      | 1000                           | Duration of the transformation in milliseconds.        |
| data-ks-easing            | string      | cubic-bezier(0.23, 1, 0.32, 1) | Easing function for the transition.                    |
| data-ks-strength          | number      | 10                             | Strength of the transformation effect.                 |
| data-ks-transformorigin   | string      | "center"                       | Origin point for transformations.                      |
| data-ks-startdistance     | number      | 100                            | Distance at which transformations start.               |
| data-ks-velocity          | "linear"    | "acceleration"                 | Animation strength depending on mouse distance.        | "linear" | Velocity curve for transformations. |
| data-ks-transform         | "translate" | "rotate"                       | Transform animation type.                              | N/A      | Type of transformation to apply.    |
| data-ks-axis              | string      | N/A                            | Axes to apply transformations (e.g., "X, Y").          |

### KinesisPath Attributes

> <span style="color:DodgerBlue">Note: Container for KinesisPathElement</span>

| Attribute                | Type   | Default Value | Description                                       |
| ------------------------ | ------ | ------------- | ------------------------------------------------- |
| data-kinesispath    | N/A     | N/A           | Marks the container element for KinesisPath.    |
| data-ks-active      | boolean | true          | Enables or disables the path effect.            |
| data-ks-duration    | number  | 1000          | Duration of the path animation in milliseconds. |
| data-ks-easing      | string  | ease          | Easing function for the transition.             |
| data-ks-path        | string  | N/A           | SVG path data for the element to follow.        |
| data-ks-interaction | "mouse" | "scroll"      | "mouse"                                         | Interaction type to trigger path movement. |
| data-ks-strength    | number  | N/A           | Strength of the path movement effect.           |
| data-ks-offset      | number  | N/A           | Initial offset along the path as a percentage.  |

### KinesisPathElement Attributes

> <span style="color:DodgerBlue">Note: Child of KinesisPathElement</span>

| Attribute                | Type   | Default Value | Description                                       |
| ------------------------ | ------ | ------------- | ------------------------------------------------- |
| data-kinesispath-element | N/A    | N/A           | Marks an element to follow a path by KinesisPath. |
| data-ks-strength         | number | 1             | Strength of the path movement effect.             |
| data-ks-offset           | number | 0             | Initial offset along the path as a percentage.    |

### KinesisScrollItem Attributes

> <span style="color:DodgerBlue">Note: Standalone component</span>

| Attribute                | Type   | Default Value | Description                                       |
| ------------------------ | ------ | ------------- | ------------------------------------------------- |
| data-kinesisscroll-item | N/A         | N/A                            | Marks an element to transform based on scroll.   |
| data-ks-active          | boolean     | true                           | Enables or disables the scroll item.             |
| data-ks-duration        | number      | 1000                           | Duration of the transformation in milliseconds.  |
| data-ks-easing          | string      | cubic-bezier(0.23, 1, 0.32, 1) | Easing function for the transition.              |
| data-ks-transform       | "translate" | "rotate"                       | "scale"                                          | N/A | Type of transformation to apply. |
| data-ks-axis            | string      | N/A                            | Axes to apply transformations (e.g., "X, Y, Z"). |
| data-ks-strength        | number      | N/A                            | Strength of the transformation effect.           |

### KinesisTransformer Attributes

> <span style="color:DodgerBlue">Note: Container for KinesisTransformerElement</span>

| Attribute                | Type   | Default Value | Description                                       |
| ------------------------ | ------ | ------------- | ------------------------------------------------- |
| data-kinesistransformer         | N/A         | N/A                            | Marks the container element for KinesisTransformer.       |
| data-ks-active                  | boolean     | true                           | Enables or disables the transformer.                      |
| data-ks-duration                | number      | 1000                           | Duration of the transformation in milliseconds.           |
| data-ks-easing                  | string      | cubic-bezier(0.23, 1, 0.32, 1) | Easing function for the transition.                       |
| data-ks-interaction             | "mouse"     | "scroll"                       | "mouse"                                                   | Interaction type to trigger transformations. |
| data-kinesistransformer-element | N/A         | N/A                            | Marks an element to be transformed by KinesisTransformer. |
| data-ks-strength                | number      | N/A                            | Strength of the transformation effect.                    |
| data-ks-transform               | "translate" | "rotate"                       | "scale"                                                   | "tilt"                                       | N/A | Type of transformation to apply. |
| data-ks-axis                    | string      | N/A                            | Axes to apply transformations (e.g., "X, Y, Z").          |

### KinesisTransformerElement Attributes

> <span style="color:DodgerBlue">Note: Child of KinesisTransformer</span>

| Attribute                | Type   | Default Value | Description                                       |
| ------------------------ | ------ | ------------- | ------------------------------------------------- |
| data-kinesistransformer-element | N/A         | N/A           | Marks an element to be transformed by KinesisTransformer. |
| data-ks-strength                | number      | 10            | Strength of the transformation effect.                    |
| data-ks-transform               | "translate" | "rotate"      | "scale"                                                   | "tilt" | N/A | Type of transformation to apply. |
| data-ks-axis                    | string      | N/A           | Axes to apply transformations (e.g., "X, Y").             |

## Usage Examples

Below are several examples demonstrating how to use Kinesis.js components in your projects.

### Simple Depth Effect

**Description:**
Creates a parallax depth effect with multiple layers that move based on mouse interactions.**HTML:**

```html
<div class="container" data-kinesisdepth data-ks-sensitivity="10">
  <div
    class="depth-element"
    data-kinesisdepth-element
    data-ks-depth="-20"
  ></div>
  <div
    class="depth-element"
    data-kinesisdepth-element
    data-ks-depth="-40"
  ></div>
  <div
    class="depth-element"
    data-kinesisdepth-element
    data-ks-depth="-60"
  ></div>
</div>
```

### Translate on Scroll on X and Y Axes

**Description:**
Applies rotation transformations to elements as the user scrolls, creating a dynamic visual effect.**HTML:**

```html
<div class="container" data-kinesistransformer data-ks-interaction="scroll">
  <div
    class="transform-element"
    data-kinesistransformer-element
    data-ks-strength="30"
    data-ks-transform="rotate"
    data-ks-axis="Z"
  ></div>
  <div
    class="transform-element"
    data-kinesistransformer-element
    data-ks-strength="-60"
    data-ks-transform="rotate"
    data-ks-axis="Z"
  ></div>
  <div
    class="transform-element"
    data-kinesistransformer-element
    data-ks-strength="90"
    data-ks-transform="rotate"
    data-ks-axis="Z"
  ></div>
</div>
```

### Standalone Scroll Item

**Description:**
Transforms a single element based on its visibility within the viewport during scrolling.**HTML:**

```html
<div class="scroll-item-container container">
  <div
    class="scroll-item"
    data-kinesisscroll-item
    data-ks-transform="scale"
    data-ks-axis="X, Y"
    data-ks-strength="100"
    style="background-color: lightgreen; width: 50px; height: 50px"
  ></div>
</div>
```

### Path-Following Elements

**Description:**
Moves elements along a predefined SVG path based on scroll interaction.**HTML:**

```html
<div
  class="path-container"
  data-kinesispath
  data-ks-path="M 100,300 C 200,100 400,500 500,300"
  data-ks-duration="100"
  data-ks-interaction="scroll"
>
  <!-- Path Elements -->
  <div
    class="path-element"
    data-kinesispath-element
    data-ks-strength="1"
    data-ks-offset="0"
  ></div>
  <div
    class="path-element"
    data-kinesispath-element
    data-ks-strength="0.5"
    data-ks-offset="50"
    style="background-color: lightblue"
  ></div>
</div>
```

### Simple Audio Effect

**Description:**
Applies scaling transformations to elements based on audio frequency data. Controls to play and stop the audio are provided.**HTML:**

```html
<div
  class="container"
  id="audio"
  data-kinesisaudio
  data-ks-audio="audio.mp3"
  data-ks-playaudio="false"
>
  <div
    class="audio-element"
    data-kinesisaudio-element
    data-ks-audioindex="60"
    data-ks-strength="50"
    data-ks-type="scale"
  ></div>
  <div
    class="audio-element"
    data-kinesisaudio-element
    data-ks-audioindex="80"
    data-ks-strength="50"
    data-ks-type="scale"
  ></div>
  <div
    class="audio-element"
    data-kinesisaudio-element
    data-ks-audioindex="100"
    data-ks-strength="50"
    data-ks-type="scale"
  ></div>
</div>
<div class="control-buttons">
  <button id="play-audio">Play Audio</button>
  <button id="stop-audio">Stop Audio</button>
</div>

<script>
  window.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("play-audio");
    const stopButton = document.getElementById("stop-audio");
    const container = document.getElementById("audio");
    const kinesisAudio = container._kinesisAudio;

    if (playButton && kinesisAudio) {
      playButton.addEventListener("click", () => kinesisAudio.play());
    }

    if (stopButton && kinesisAudio) {
      stopButton.addEventListener("click", () => kinesisAudio.stop());
    }
  });
</script>
```

### Tilt Effect

**Description:**
Applies a tilt transformation to elements based on mouse interactions.**HTML:**

```html
<div data-kinesistransformer class="tilt-container">
  <div data-kinesistransformer-element data-ks-transform="tilt">Hello</div>
  <div data-kinesistransformer-element data-ks-transform="tilt">Hello</div>
  <div
    data-kinesistransformer-element
    data-ks-transform="tilt"
    data-ks-strength="50"
  >
    Hello
  </div>
</div>
```
## License

Kinesis.js is licensed under the [MIT License](https://chatgpt.com/c/LICENSE) .
