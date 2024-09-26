import { TransformAxisType } from "./types";

/**
 * Clamps a value between a specified minimum and maximum range.
 *
 * @param value - The value to clamp.
 * @param min - The minimum allowed value.
 * @param max - The maximum allowed value.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Gets the normalized position of the mouse relative to the center of an element.
 *
 * @param event - The mouse event containing the cursor position.
 * @param element - The element to which the mouse position is relative.
 * @returns An object containing normalized x and y coordinates, with respect to the element center.
 */
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

/**
 * Gets the absolute position of the mouse on the screen from the MouseEvent.
 *
 * @param event - The mouse event containing the cursor position.
 * @returns An object with the x and y coordinates of the mouse position.
 */
export function getMousePositionDistance(event: MouseEvent): {
  x: number;
  y: number;
} {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

/**
 * Parses a comma-separated string of axes ("X", "Y", "Z") into an array of valid TransformAxisType.
 *
 * @param value - A string containing the axes to parse (e.g., "X,Y,Z").
 * @returns An array of valid TransformAxisType axes.
 */
export function parseTransformAxes(value: string): TransformAxisType[] {
  const axes = value.split(",").map((axis) => axis.trim().toUpperCase());
  const validAxes: TransformAxisType[] = ["X", "Y", "Z"];
  return axes.filter((axis) =>
    validAxes.includes(axis as TransformAxisType)
  ) as TransformAxisType[];
}

/**
 * Creates a throttled version of the given function that ensures the function
 * is called at most once per animation frame, or at a specified interval if provided.
 *
 * @param func - The function to throttle.
 * @param interval - (Optional) The duration in milliseconds to throttle the function. If not provided, requestAnimationFrame is used.
 * @returns A throttled version of the function that calls the original function at most once per frame or per the specified interval.
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  interval?: number
): (...args: Parameters<T>) => void {
  let ticking = false;
  let lastTime = 0;

  if (interval) {
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      const now = Date.now();
      if (now - lastTime >= interval) {
        func.apply(this, args);
        lastTime = now;
      }
    };
  } else {
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
}

/**
 * Creates a debounced version of the given function that delays its execution
 * until after a specified wait time has passed since the last time it was invoked.
 *
 * @param func - The function to debounce.
 * @param wait - The number of milliseconds to delay.
 * @returns A debounced version of the function that delays execution.
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, wait);
  };
}
