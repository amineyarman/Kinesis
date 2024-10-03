export type TransformAxisType = "X" | "Y" | "Z";

export type InteractionAxisType = "X" | "Y";

export type TransformType =
  | "translate"
  | "rotate"
  | "scale"
  | "tilt"
  | "tilt_inv";

export type InteractionType = "attraction" | "repulsion" | "linear";

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
}

export interface KinesisScrollItemOptions {
  active?: boolean;
  duration?: number;
  easing?: string;
  transformType?: TransformType;
  transformAxis?: string | null;
  strength?: number;
}

export interface KinesisPathOptions {
  active?: boolean;
  duration?: number;
  easing?: string;
  path?: string;
  interaction?: "mouse" | "scroll";
}

export type InteractionModeType = "attraction" | "repulsion" | "neutral";

export interface KinesisDistanceItemOptions {
  active?: boolean;
  strength?: number;
  transformOrigin?: string;
  startDistance?: number;
  interactionType?: InteractionType; // New attribute
  transformType?: TransformType;
}
