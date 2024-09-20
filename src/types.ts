export type AxisType = "X" | "Y" | "Z";

export type TransformType =
  | "translate"
  | "rotate"
  | "scale"
  | "tilt"
  | "tilt_inv";

export type VelocityType = "linear" | "acceleration" | "deceleration";

export interface KinesisTransformerOptions {
  active?: boolean;
  duration?: number;
  easing?: string;
  interaction?: "mouse" | "scroll";
}

export interface KinesisDepthOptions {
  active?: boolean;
  duration?: number;
  easing?: string;
  perspective?: number;
  sensitivity?: number;
  inverted?: boolean;
}

export interface KinesisAudioOptions {
  active?: boolean;
  duration?: number;
  easing?: string;
  tag?: string;
  perspective?: number;
  audio: string;
  playAudio?: boolean;
  axis?: string;
}

export interface KinesisScrollItemOptions {
  active?: boolean;
  duration?: number;
  easing?: string;
  transformType?: TransformType;
  axis?: string;
  strength?: number;
}

export interface KinesisPathOptions {
  active?: boolean;
  duration?: number;
  easing?: string;
  path?: string;
  interaction?: "mouse" | "scroll";
}

export interface KinesisDistanceItemOptions {
  active?: boolean;
  strength?: number;
  transformOrigin?: string;
  startDistance?: number;
  velocity?: VelocityType;
  transformType?: TransformType;
  duration?: number;
  easing?: string;
}
