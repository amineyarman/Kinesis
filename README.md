# Kinesis

`@amineyrman/kinesis` is a versatile library for adding dynamic, interactive, and physics-based animations to your web components. It includes features like transforming elements based on mouse movement, scroll events, and even audio frequency data.

## Installation

You can install `kinesis` via npm:

```bash
npm install @amineyrman/kinesis
```

## Usage

### Basic Initialization

To initialize the library, import the `initializeKinesis` function and call it after your DOM elements are loaded:

```javascript
import { initializeKinesis } from "@amineyrman/kinesis";

document.addEventListener("DOMContentLoaded", () => {
  initializeKinesis();
});
```

This will automatically find and initialize all elements that use the Kinesis attributes.

## Components

### KinesisTransformer

The `KinesisTransformer` class applies transformations such as translations, rotations, or scaling to child elements based on mouse movements or scroll events.

#### Example

```html
<div data-kinesistransformer data-ks-duration="1000" data-ks-perspective="800">
  <div data-kinesistransformer-element data-ks-strength="20"></div>
</div>
```

#### Attributes

| Attribute           | Default                        | Type    | Description                                 |
| ------------------- | ------------------------------ | ------- | ------------------------------------------- | ---------------------------------- |
| data-ks-active      | true                           | boolean | Whether the component is active.            |
| data-ks-duration    | 1000                           | number  | Duration of the transition in milliseconds. |
| data-ks-easing      | cubic-bezier(0.23, 1, 0.32, 1) | string  | Easing function for the transition.         |
| data-ks-interaction | "mouse"                        | "mouse" | "scroll"                                    | Interaction type: mouse or scroll. |
| data-ks-perspective | 1000px                         | string  | Perspective for 3D transformations.         |
| data-ks-preserve3d  | true                           | boolean | Whether to preserve the 3D transformations. |

### KinesisTransformerElement

The `KinesisTransformerElement` class is a child element within the `KinesisTransformer` container. It applies the specified transformations (e.g., translate, rotate) when the container’s interaction (mouse or scroll) is triggered.

#### Attributes

| Attribute               | Default         | Type                | Description                                                          |
| ----------------------- | --------------- | ------------------- | -------------------------------------------------------------------- |
| data-ks-strength        | 10              | number              | The intensity of the transformation.                                 |
| data-ks-transform       | "translate"     | TransformType       | Type of transformation: translate, rotate, scale, tilt, or tilt_inv. |
| data-ks-transformAxis   | "X, Y"          | string              | The axis along which the transformation occurs (X, Y, Z).            |
| data-ks-interactionAxis | null            | interactionAxisType | Constrains movement to react to mouse movemet on either X or Y axis. |
| data-ks-transformOrigin | "center center" | string              | Origin for the transformation.                                       |

### KinesisDepth

The `KinesisDepth` class applies 3D depth transformations to child elements based on mouse movement, making them move along the Z-axis.

#### Example

```html
<div data-kinesisdepth data-ks-perspective="1200" data-ks-sensitivity="15">
  <div data-kinesisdepth-element data-ks-depth="5"></div>
</div>
```

#### Attributes

| Attribute           | Default                        | Type    | Description                                 |
| ------------------- | ------------------------------ | ------- | ------------------------------------------- |
| data-ks-active      | true                           | boolean | Whether the component is active.            |
| data-ks-duration    | 1000                           | number  | Duration of the transition in milliseconds. |
| data-ks-easing      | cubic-bezier(0.23, 1, 0.32, 1) | string  | Easing function for the transition.         |
| data-ks-perspective | 1000                           | number  | Perspective value for the depth effect.     |
| data-ks-sensitivity | 10                             | number  | Sensitivity of the depth effect.            |
| data-ks-invert      | false                          | boolean | Whether to invert the movement effect.      |

### KinesisDepthElement

A child element inside the `KinesisDepth` container. It moves along the Z-axis based on the depth.

#### Attributes

| Attribute     | Default | Type   | Description                      |
| ------------- | ------- | ------ | -------------------------------- |
| data-ks-depth | 10      | number | The Z-axis depth of the element. |

### KinesisAudio

Transforms elements based on audio data. Elements move or scale according to audio frequency values.

#### Example

```html
<div data-kinesisaudio data-ks-audio="audiofile.mp3" data-ks-playaudio="true">
  <div data-kinesisaudio-element data-ks-strength="30"></div>
</div>
```

#### Attributes

| Attribute         | Default                        | Type    | Description                                               |
| ----------------- | ------------------------------ | ------- | --------------------------------------------------------- |
| data-ks-active    | true                           | boolean | Whether the component is active.                          |
| data-ks-duration  | 1000                           | number  | Duration of the transition in milliseconds.               |
| data-ks-easing    | cubic-bezier(0.23, 1, 0.32, 1) | string  | Easing function for the transition.                       |
| data-ks-audio     | ""                             | string  | Audio source URL.                                         |
| data-ks-playaudio | false                          | boolean | Whether the audio should autoplay.                        |
| data-ks-axis      | "X, Y"                         | string  | The axis on which the element transforms (X, Y, or both). |

### KinesisAudioElement

A child element inside the `KinesisAudio` container. It responds to audio frequency data to animate transformations like scaling or translation.

#### Attributes

| Attribute          | Default | Type   | Description                                                 |
| ------------------ | ------- | ------ | ----------------------------------------------------------- |
| data-ks-strength   | 10      | number | The strength of the transformation based on the audio.      |
| data-ks-audioindex | 50      | number | Index of the audio frequency band this element responds to. |

### KinesisScrollItem

Transforms elements based on scroll position. Ideal for parallax effects. This is a standalone component. It doesn't need to be wrapped by one of the containers.

#### Example

```html
<div
  data-kinesisscroll-item
  data-ks-transform="scale"
  data-ks-strength="15"
></div>
```

#### Attributes

| Attribute         | Default                        | Type          | Description                                               |
| ----------------- | ------------------------------ | ------------- | --------------------------------------------------------- |
| data-ks-active    | true                           | boolean       | Whether the component is active.                          |
| data-ks-duration  | 1000                           | number        | Duration of the transition in milliseconds.               |
| data-ks-easing    | cubic-bezier(0.23, 1, 0.32, 1) | string        | Easing function for the transition.                       |
| data-ks-transform | "translate"                    | TransformType | Type of transformation: translate, rotate, or scale.      |
| data-ks-axis      | "Y"                            | string        | The axis on which the element transforms (X, Y, or both). |
| data-ks-strength  | 10                             | number        | Strength of the effect relative to scroll position.       |

### KinesisPath

Moves elements along an SVG path based on mouse movement or scroll events.

#### Example

```html
<div data-kinesispath data-ks-path="M10,10 C20,20 40,20 50,10">
  <div data-kinesispath-element></div>
</div>
```

#### Attributes

| Attribute             | Default   | Type      | Description                                 |
| ---------------- | ------- | ------ | ------------------------------------------------------ |
| data-ks-active        | true      | boolean   | Whether the component is active.            |
| `data-ks-duration`    | `800`     | `number`  | Duration of the transition in milliseconds. |
| `data-ks-easing`      | `ease`    | `string`  | Easing function for the transition.         |
| `data-ks-path`        | `""`      | `string`  | The SVG path that the element follows.      |
| `data-ks-interaction` | `"mouse"` | `"mouse"` | `"scroll"`                                  | Interaction type: mouse or scroll. |

### KinesisPathElement

A child element inside the `KinesisPath` container. It moves along the specified SVG path.

#### Attributes

| Attribute        | Default | Type   | Description                                            |
| ---------------- | ------- | ------ | ------------------------------------------------------ |
| data-ks-strength | 1       | number | The strength of the element's movement along the path. |
| data-ks-offset   | 0       | number | The initial offset (in %) along the path.              |

### KinesisDistanceItem

Transforms elements based on the distance between the mouse pointer and the element. This is a standalone component. It doesn't need to be wrapped in one of the containers.

#### Example

```html
<div
  data-kinesisdistance-item
  data-ks-strength="15"
  data-ks-startdistance="200"
></div>
```

#### Attributes

| Attribute               | Default  | Type     | Description                                        |
| ---------------- | ------- | ------ | ------------------------------------------------------ |
| data-ks-active          | true     | boolean  | Whether the component is active.                   |
| data-ks-strength        | 20       | number   | Strength of the effect based on mouse distance.    |
| data-ks-transformOrigin | "center" | string   | Origin of the transformation.                      |
| data-ks-startdistance   | 100      | number   | The distance from which the transformation begins. |
| data-ks-velocity        | "linear" | "linear" | "acceleration"                                     | "deceleration" | Speed profile for the transformation. |

## License

This project is licensed under the MIT License.
