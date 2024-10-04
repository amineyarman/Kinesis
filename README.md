# Kinesis

`@amineyarman/kinesis` is a versatile library for adding dynamic, interactive, and physics-based animations to your web components. It includes features like transforming elements based on mouse movement, scroll events, and even audio frequency data.

## Installation

You can install `kinesis` via npm:

```bash
npm install @amineyarman/kinesis
```

## Usage

### Basic Initialization

To initialize the library, import the `initializeKinesis` function and call it after your DOM elements are loaded:

```javascript
import { initializeKinesis } from "@amineyarman/kinesis";

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

| Attribute | Type | Default Value | Description | 
| --- | --- | --- | --- | 
| data-kinesistransformer | Boolean (presence) | Required | Marks the element as a Kinesis Transformer container. Must be present to enable transformer effects. | 
| data-ks-active | Boolean | true | Enables or disables the transformer. Set to false to deactivate without removing the component. | 
| data-ks-duration | Number | 1000 | Duration of the transformation transition in milliseconds. | 
| data-ks-easing | String | cubic-bezier(0.23, 1, 0.32, 1) | CSS easing function for the transformation transition. | 
| data-ks-interaction | Enum (mouse or scroll) | mouse | Defines the interaction mode. Use mouse for mouse movements or scroll for scroll-based interactions. | 
| data-ks-perspective | Number | 1000 | Sets the CSS perspective for 3D transformations in pixels. | 
| data-ks-preserve3d | Boolean | true | Determines whether the container should preserve 3D transformations across child elements. Set to false to disable. | 
| data-ks-scroll-element | String (CSS Selector) | window | (For scroll interaction) Specifies the scroll container element. Use a CSS selector to target a specific scrollable element. Defaults to window. |

### KinesisTransformerElement

The `KinesisTransformerElement` class is a child element within the `KinesisTransformer` container. It applies the specified transformations (e.g., translate, rotate) when the container’s interaction (mouse or scroll) is triggered.

#### Attributes

| Attribute                       | Type                                            | Default Value          | Description                                                                                                                                   |
| ------------------------------- | ----------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| data-kinesistransformer-element | Boolean (presence)                              | Required               | Marks the element as a transformer element. Must be present to apply transformations.                                                         |
| data-ks-strength                | Number                                          | 10                     | Determines the intensity of the transformation effect. Higher values result in more pronounced transformations.                               |
| data-ks-transform               | Enum (translate, rotate, scale, tilt, tilt_inv) | translate              | Specifies the type of transformation to apply.                                                                                                |
| data-ks-transformAxis           | String                                          | X, Y (or Z for rotate) | Defines the axes along which the transformation is applied. Use a comma-separated list (e.g., X, Y, Z).                                       |
| data-ks-interactionAxis         | Enum (X, Y) or null                             | null                   | Restricts the interaction to a specific axis. Set to X or Y to limit transformations to that axis. If not set, interactions affect both axes. |
| data-ks-transformOrigin         | String                                          | center center          | Sets the CSS transform-origin property, defining the point around which transformations are applied (e.g., top left, 50% 50%).                |

### KinesisDepth

The `KinesisDepth` class applies 3D depth transformations to child elements based on mouse movement, making them move along the Z-axis.

#### Example

```html
<div data-kinesisdepth data-ks-perspective="1200" data-ks-sensitivity="15">
  <div data-kinesisdepth-element data-ks-depth="5"></div>
</div>
```

#### Attributes

| Attribute           | Type               | Default Value                  | Description                                                                                                        |
| ------------------- | ------------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| data-kinesisdepth   | Boolean (presence) | Required                       | Marks the element as a Kinesis Depth container. Must be present to enable depth effects.                           |
| data-ks-active      | Boolean            | true                           | Enables or disables the depth effects. Set to false to deactivate without removing the component.                  |
| data-ks-duration    | Number             | 1000                           | Duration of the transformation transition in milliseconds.                                                         |
| data-ks-easing      | String             | cubic-bezier(0.23, 1, 0.32, 1) | CSS easing function for the transformation transition.                                                             |
| data-ks-perspective | Number             | 1000                           | Sets the CSS perspective for 3D transformations in pixels.                                                         |
| data-ks-sensitivity | Number             | 40                             | Determines the sensitivity of rotation based on mouse position. Higher values result in more pronounced rotations. |
| data-ks-inverted    | Boolean            | false                          | Inverts the direction of rotation. Set to true to reverse the rotation effects.                                    |
| data-ks-throttle    | Number             | 100                            | Throttling duration in milliseconds for mousemove events to optimize performance. Default is 100ms.                |

### KinesisDepthElement

A child element inside the `KinesisDepth` container. It moves along the Z-axis based on the depth.

#### Attributes

| Attribute                 | Type               | Default Value | Description                                                                                                     |
| ------------------------- | ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------- |
| data-kinesisdepth-element | Boolean (presence) | Required      | Marks the element as a depth-enabled child. Must be present to apply depth translations.                        |
| data-ks-depth             | Number             | 10            | Determines the depth translation along the Z-axis. Higher values move the element further away from the viewer. |
| data-ks-transformorigin   | String             | center center | Sets the CSS transform-origin property, defining the point around which transformations are applied.            |

### KinesisAudio

Transforms elements based on audio data. Elements move or scale according to audio frequency values.

#### Example

```html
<div data-kinesisaudio data-ks-audio="audiofile.mp3" data-ks-playaudio="true">
  <div data-kinesisaudio-element data-ks-strength="30"></div>
</div>
```

#### Attributes

| Attribute           | Type               | Default Value                  | Description                                                                                         |
| ------------------- | ------------------ | ------------------------------ | --------------------------------------------------------------------------------------------------- |
| data-kinesisaudio   | Boolean (presence) | Required                       | Marks the element as a Kinesis Audio container. Must be present to enable audio-responsive effects. |
| data-ks-active      | Boolean            | true                           | Enables or disables the audio effects. Set to false to deactivate without removing the component.   |
| data-ks-duration    | Number             | 1000                           | Duration of the transformation transition in milliseconds.                                          |
| data-ks-easing      | String             | cubic-bezier(0.23, 1, 0.32, 1) | CSS easing function for the transformation transition.                                              |
| data-ks-perspective | Number             | 1000                           | Sets the CSS perspective for 3D transformations in pixels.                                          |
| data-ks-audio       | String (URL)       | Required                       | Specifies the source URL of the audio file to be analyzed and played.                               |
| data-ks-playaudio   | Boolean            | false                          | Determines whether the audio should play automatically. Set to true to enable auto-play.            |
| data-ks-throttle    | Number             | 100                            | Throttling duration in milliseconds for mousemove events to optimize performance. Default is 100ms. |

### KinesisAudioElement

A child element inside the `KinesisAudio` container. It responds to audio frequency data to animate transformations like scaling or translation.

#### Attributes

| Attribute                 | Type                            | Default Value          | Description                                                                                                                 |
| ------------------------- | ------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| data-kinesisaudio-element | Boolean (presence)              | Required               | Marks the element as an audio-responsive child. Must be present to apply audio-based transformations.                       |
| data-ks-audioindex        | Number                          | 50                     | Specifies the frequency bin index to be used for transforming the element. Higher indices correspond to higher frequencies. |
| data-ks-strength          | Number                          | 10                     | Determines the intensity of the transformation effect. Higher values result in more pronounced transformations.             |
| data-ks-transform         | Enum (translate, rotate, scale) | translate              | Specifies the type of transformation to apply based on audio data.                                                          |
| data-ks-transformAxis     | String                          | X, Y (or Z for rotate) | Defines the axes along which the transformation is applied. Use a comma-separated list (e.g., X, Y, Z).                     |
| data-ks-transformorigin   | String                          | center                 | Sets the CSS transform-origin property, defining the point around which transformations are applied (e.g., top left).       |

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

| Attribute               | Type                            | Default Value                  | Description                                                                                                     |
| ----------------------- | ------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| data-kinesisscroll-item | Boolean (presence)              | Required                       | Marks the element as a Kinesis Scroll Item. Must be present to enable scroll-based transformations.             |
| data-ks-active          | Boolean                         | true                           | Enables or disables the scroll effects. Set to false to deactivate without removing the component.              |
| data-ks-duration        | Number                          | 1000                           | Duration of the transformation transition in milliseconds.                                                      |
| data-ks-easing          | String                          | cubic-bezier(0.23, 1, 0.32, 1) | CSS easing function for the transformation transition.                                                          |
| data-ks-transform       | Enum (translate, rotate, scale) | translate                      | Specifies the type of transformation to apply based on scroll progress.                                         |
| data-ks-transformAxis   | String                          | X, Y (or Z for rotate)         | Defines the axes along which the transformation is applied. Use a comma-separated list (e.g., X, Y, Z).         |
| data-ks-strength        | Number                          | 10                             | Determines the intensity of the transformation effect. Higher values result in more pronounced transformations. |
| data-ks-throttle        | Number                          | 100                            | Throttling duration in milliseconds for scroll event handling to optimize performance. Default is 100ms.        |

### KinesisPath

Moves elements along an SVG path based on mouse movement or scroll events.

#### Example

```html
<div data-kinesispath data-ks-path="M10,10 C20,20 40,20 50,10">
  <div data-kinesispath-element></div>
</div>
```

#### Attributes

| Attribute           | Type                   | Default Value                  | Description                                                                                          |
| ------------------- | ---------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| data-kinesispath    | Boolean (presence)     | Required                       | Marks the element as a Kinesis Path container. Must be present to enable path-based animations.      |
| data-ks-active      | Boolean                | true                           | Enables or disables the path effects. Set to false to deactivate without removing the component.     |
| data-ks-duration    | Number                 | 800                            | Duration of the transformation transition in milliseconds.                                           |
| data-ks-easing      | String                 | cubic-bezier(0.23, 1, 0.32, 1) | CSS easing function for the transformation transition.                                               |
| data-ks-path        | String (SVG Path Data) | Required                       | Specifies the global SVG path data that child elements will follow.                                  |
| data-ks-interaction | Enum (mouse or scroll) | mouse                          | Defines the interaction mode. Use mouse for mouse movements or scroll for scroll-based interactions. |
| data-ks-throttle    | Number                 | 100                            | Throttling duration in milliseconds for event handling to optimize performance. Default is 100ms.    |

### KinesisPathElement

A child element inside the `KinesisPath` container. It moves along the specified SVG path.

#### Attributes

| Attribute                | Type                            | Default Value                  | Description                                                                                                              |
| ------------------------ | ------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| data-kinesispath-element | Boolean (presence)              | Required                       | Marks the element as a path-enabled child. Must be present to apply path-based transformations.                          |
| data-ks-strength         | Number                          | 1                              | Determines the strength or speed of the transformation effect. Higher values result in faster or more intense movements. |
| data-ks-offset           | Number                          | 0                              | Sets the initial offset distance along the path in percentage.                                                           |
| data-ks-duration         | Number                          | 1000                           | Duration of the transformation transition in milliseconds.                                                               |
| data-ks-easing           | String                          | cubic-bezier(0.23, 1, 0.32, 1) | CSS easing function for the transformation transition.                                                                   |
| data-ks-transform        | Enum (translate, rotate, scale) | translate                      | Specifies the type of transformation to apply based on path data.                                                        |
| data-ks-transformAxis    | String                          | X, Y (or Z for rotate)         | Defines the axes along which the transformation is applied. Use a comma-separated list (e.g., X, Y, Z).                  |
| data-ks-transformorigin  | String                          | center                         | Sets the CSS transform-origin property, defining the point around which transformations are applied (e.g., top left).    |

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

| Attribute                 | Type                                 | Default Value                  | Description                                                                                                                                                             |
| ------------------------- | ------------------------------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data-kinesisdistance-item | Boolean (presence)                   | Required                       | Marks the element as a Kinesis Distance item. Must be present to enable distance-based transformations.                                                                 |
| data-ks-active            | Boolean                              | true                           | Enables or disables the distance effects. Set to false to deactivate without removing the component.                                                                    |
| data-ks-strength          | Number                               | 20                             | Determines the intensity of the transformation effect. Higher values result in more pronounced transformations.                                                         |
| data-ks-transformorigin   | String                               | center                         | Sets the CSS transform-origin property, defining the point around which transformations are applied (e.g., top left).                                                   |
| data-ks-startdistance     | Number                               | 100                            | Defines the distance threshold (in pixels) at which transformations begin to take effect.                                                                               |
| data-ks-interaction       | Enum (linear, attraction, repulsion) | linear                         | Specifies the interaction type. linear applies transformations based purely on distance, attraction pulls the element towards the cursor, and repulsion pushes it away. |
| data-ks-transform         | Enum (translate, rotate, scale)      | translate                      | Specifies the type of transformation to apply based on cursor distance.                                                                                                 |
| data-ks-easing            | String                               | cubic-bezier(0.23, 1, 0.32, 1) | CSS easing function for the transformation transition.                                                                                                                  |
| data-ks-duration          | Number                               | 1000                           | Duration of the transformation transition in milliseconds.                                                                                                              |

## License

This project is licensed under the MIT License.
