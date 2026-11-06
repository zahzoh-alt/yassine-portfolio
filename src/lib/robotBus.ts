/**
 * Robot bus — a tiny, framework-free channel between the DOM (sections, cards,
 * buttons) and the 3D robot living in the WebGL layer.
 *
 * DOM components call the helpers below (robotLook, robotVisit, robotWave…);
 * the robot reads `robotState` every frame. No React re-render is involved,
 * so hovering cards never costs a render pass.
 */

export type RobotState = {
  /** Element the robot is curious about (hover / focus). */
  focusEl: Element | null;
  /** 0 → only turns its head, 1 → flies right next to the element. */
  focusStrength: number;
  /** Element that temporarily replaces the section slot (e.g. project modal). */
  overrideEl: Element | null;
  /** performance.now() timestamps of one-shot gestures. */
  spinAt: number;
  waveAt: number;
  holoAt: number;
  /** When true the WebGL layer is raised above the page (modal open). */
  front: boolean;
};

export const robotState: RobotState = {
  focusEl: null,
  focusStrength: 0,
  overrideEl: null,
  spinAt: -1e9,
  waveAt: -1e9,
  holoAt: -1e9,
  front: false,
};

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeRobot(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function emit() {
  listeners.forEach((fn) => fn());
}

const now = () => (typeof performance !== "undefined" ? performance.now() : 0);

/** Robot turns towards an element and drifts a little closer to it. */
export function robotLook(el: Element | null, strength = 0.22) {
  robotState.focusEl = el;
  robotState.focusStrength = strength;
  robotState.holoAt = now();
}

export function robotRelease(el?: Element | null) {
  if (el && robotState.focusEl !== el) return;
  robotState.focusEl = null;
  robotState.focusStrength = 0;
}

/** Robot flies to the element, then hands over to `thenEl` (if any). */
let visitTimer: ReturnType<typeof setTimeout> | undefined;
export function robotVisit(el: Element, thenEl?: Element | null, ms = 650) {
  clearTimeout(visitTimer);
  robotState.focusEl = el;
  robotState.focusStrength = 0.92;
  robotState.spinAt = now();
  if (thenEl) {
    // A modal is opening: bring the robot above it right away.
    robotState.front = true;
    emit();
  }
  visitTimer = setTimeout(() => {
    robotRelease(el);
    if (thenEl) robotDock(thenEl);
  }, ms);
}

/** Pin the robot to a specific element and bring the 3D layer to the front. */
export function robotDock(el: Element | null) {
  robotState.overrideEl = el;
  robotState.front = !!el;
  emit();
}

export function robotUndock() {
  clearTimeout(visitTimer);
  robotState.overrideEl = null;
  robotState.front = false;
  robotRelease();
  emit();
}

export function robotSpin() {
  robotState.spinAt = now();
}

export function robotWave() {
  robotState.waveAt = now();
}

/** Spread on any element: the robot looks at it on hover / keyboard focus. */
export function robotHoverProps(strength = 0.22) {
  return {
    onMouseEnter: (e: { currentTarget: Element }) => robotLook(e.currentTarget, strength),
    onMouseLeave: (e: { currentTarget: Element }) => robotRelease(e.currentTarget),
    onFocus: (e: { currentTarget: Element }) => robotLook(e.currentTarget, strength),
    onBlur: (e: { currentTarget: Element }) => robotRelease(e.currentTarget),
  };
}
