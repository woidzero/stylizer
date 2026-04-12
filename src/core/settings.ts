import { __CHANGELOG__, __VERSION__ } from "../generated/meta";
import { Settings } from "spcr-settings";

export const THEMES: Record<string, string> = {
  "one-dark": "prism-one-dark.css",
  "vscode-dark": "prism-vsc-dark-plus.css",
};

export const DEFAULTS = {
  EDITOR_POSITION: { x: "100px", y: "100px" },
  EDITOR_SIZE: { width: "600px", height: "400px" },
  EDITOR_TOGGLE_KEY: "F12",
  EDITOR_MIN_SIZE: { width: "100px", height: "100px" },
  EDITOR_LINE_HEIGHT: 1.4,
  EDITOR_FONT: { family: "Jetbrains Mono", size: "12px" },
  EDITOR_TAB_SIZE: 2,
  EDITOR_THEME: "one-dark",
} as const;

export const KEYS = {
  CSS: "css",
  VERSION: "version",
  EDITOR_X: "editor.position-x",
  EDITOR_Y: "editor.position-y",
  EDITOR_WIDTH: "editor.width",
  EDITOR_HEIGHT: "editor.height",
  EDITOR_TOGGLE_KEY: "editor.toggle-key",
  EDITOR_LINE_HEIGHT: "editor.line-height",
  EDITOR_FONT_FAMILY: "editor.font-family",
  EDITOR_FONT_SIZE: "editor.font-size",
  EDITOR_TAB_SIZE: "editor.tab-size",
  EDITOR_THEME: "editor.theme",
} as const;

export const setupSettings = (): Settings => {
  const settings = new Settings("Stylizer", "stylizer");

  settings.Hidden(KEYS.CSS, "");
  settings.Hidden(KEYS.VERSION, __VERSION__);
  settings.Hidden(KEYS.EDITOR_X, String(DEFAULTS.EDITOR_POSITION.x));
  settings.Hidden(KEYS.EDITOR_Y, String(DEFAULTS.EDITOR_POSITION.y));
  settings.Hidden(KEYS.EDITOR_WIDTH, String(DEFAULTS.EDITOR_SIZE.width));
  settings.Hidden(KEYS.EDITOR_HEIGHT, String(DEFAULTS.EDITOR_SIZE.height));
  settings.Hidden(KEYS.EDITOR_LINE_HEIGHT, String(DEFAULTS.EDITOR_LINE_HEIGHT));
  settings.Input(KEYS.EDITOR_THEME, "Editor Theme", DEFAULTS.EDITOR_THEME, "Editor Theme");
  settings.Input(KEYS.EDITOR_TAB_SIZE, "Editor Tab size", String(DEFAULTS.EDITOR_TAB_SIZE), "Keybind", "Default to F12");
  settings.Input(
    KEYS.EDITOR_FONT_FAMILY,
    "Font Family",
    String(DEFAULTS.EDITOR_FONT.family),
    "Font Family",
    `Default to ${DEFAULTS.EDITOR_FONT.family}`,
  );
  settings.Input(
    KEYS.EDITOR_FONT_SIZE,
    "Font Size",
    String(DEFAULTS.EDITOR_FONT.size),
    "Font Size",
    `Default to ${DEFAULTS.EDITOR_FONT.size}`,
  );
  settings.Input(
    KEYS.EDITOR_TOGGLE_KEY,
    "Keybind used to toggle Stylizer editor window",
    DEFAULTS.EDITOR_TOGGLE_KEY,
    "Keybind",
    `Default to ${DEFAULTS.EDITOR_TOGGLE_KEY}`,
  );

  return settings;
};


export const settings = setupSettings();