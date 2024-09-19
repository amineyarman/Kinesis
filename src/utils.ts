import { AxisType } from "./types";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getMousePosition(event: MouseEvent, element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / rect.width - 0.5,
    y: (event.clientY - rect.top) / rect.height - 0.5,
  };
}

export function getMousePositionDistance(event: MouseEvent): {
  x: number;
  y: number;
} {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

export function parseAxes(value: string): AxisType[] {
  const axes = value.split(",").map((axis) => axis.trim().toUpperCase());
  const validAxes: AxisType[] = ["X", "Y", "Z"];
  return axes.filter((axis) =>
    validAxes.includes(axis as AxisType)
  ) as AxisType[];
}
