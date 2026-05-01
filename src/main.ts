import "./style.css";

const INITIAL_VISIBLE_MS = 5_000;
const MOVE_VISIBLE_MS = 2_000;

const actions = document.querySelector<HTMLDivElement>(".actions");
const fullscreenButton = document.querySelector<HTMLButtonElement>(
  ".actions__fullscreen",
);

let hideTimer: ReturnType<typeof setTimeout> | undefined;

/** Pointer path for this button; mouse/pen/touch clicks should blur focus so `.actions` can hide */
let lastPointerActivated = false;

function scheduleHiddenAfter(delayMs: number) {
  if (!actions) return;
  if (hideTimer !== undefined) {
    clearTimeout(hideTimer);
  }
  actions.classList.add("is-shown");
  hideTimer = setTimeout(() => {
    hideTimer = undefined;
    actions.classList.remove("is-shown");
  }, delayMs);
}

if (actions) {
  scheduleHiddenAfter(INITIAL_VISIBLE_MS);

  window.addEventListener("mousemove", () => {
    scheduleHiddenAfter(MOVE_VISIBLE_MS);
  });

  actions.addEventListener("focusin", () => {
    scheduleHiddenAfter(MOVE_VISIBLE_MS);
  });
}

fullscreenButton?.addEventListener("pointerdown", (e) => {
  lastPointerActivated =
    e.pointerType === "mouse" ||
    e.pointerType === "pen" ||
    e.pointerType === "touch";
});

fullscreenButton?.addEventListener("keydown", () => {
  lastPointerActivated = false;
});

function toggleFullscreen() {
  const el = document.fullscreenElement;
  if (el) {
    void document.exitFullscreen();
    return;
  }
  void document.documentElement.requestFullscreen();
}

fullscreenButton?.addEventListener("click", () => {
  if (!document.documentElement.requestFullscreen) return;
  void toggleFullscreen();

  if (lastPointerActivated) {
    queueMicrotask(() => fullscreenButton?.blur());
  }
  lastPointerActivated = false;
});
