import { TransformAxisType } from "./types";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getMousePosition(event: MouseEvent, element: HTMLElement) {
  const rect = element.getBoundingClientRect(); // Get the element's bounding box

  // Calculate the relative position of the mouse with respect to the center of the element
  const relativeX = event.clientX - rect.left - rect.width / 2;
  const relativeY = event.clientY - rect.top - rect.height / 2;

  // Normalize the values based on half the width and height
  const normalizedX = relativeX / (rect.width / 2);
  const normalizedY = relativeY / (rect.height / 2);

  return {
    x: normalizedX,
    y: normalizedY,
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

export function parseTransformAxes(value: string): TransformAxisType[] {
  const axes = value.split(",").map((axis) => axis.trim().toUpperCase());
  const validAxes: TransformAxisType[] = ["X", "Y", "Z"];
  return axes.filter((axis) =>
    validAxes.includes(axis as TransformAxisType)
  ) as TransformAxisType[];
}

export function throttle<T extends (...args: any[]) => void>(
  func: T
): (...args: Parameters<T>) => void {
  let ticking = false;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (!ticking) {
      requestAnimationFrame(() => {
        func.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}
