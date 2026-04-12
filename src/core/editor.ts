const {
  React: { useState, useRef, useMemo },
} = Spicetify;

import { Settings } from "spcr-settings";
import { KEYS, DEFAULTS, setupSettings } from "./settings";

/**
 * Hook to manage settings persistence
 */
export const useEditorSettings = (): Settings => {
  const settingsRef = useRef();

  if (!settingsRef.current) settingsRef.current = setupSettings();

  return settingsRef.current;
};

/**
 * Hook to manage editor state and actions
 */
export const useEditorState = (settings: Settings): _EditorProps => {
  const saveTimeout = useRef(null);

  const [state, setState]: any = useState(() => ({
    code: settings.getFieldValue<string>(KEYS.CSS) ?? "",
    toggleKey:
      settings.getFieldValue(KEYS.EDITOR_TOGGLE_KEY) ??
      DEFAULTS.EDITOR_TOGGLE_KEY,
    position: {
      x: settings.getFieldValue(KEYS.EDITOR_X) ?? DEFAULTS.EDITOR_POSITION.x,
      y: settings.getFieldValue(KEYS.EDITOR_Y) ?? DEFAULTS.EDITOR_POSITION.y,
    },
    size: {
      width:
        settings.getFieldValue(KEYS.EDITOR_WIDTH) ?? DEFAULTS.EDITOR_SIZE.width,

      height:
        settings.getFieldValue(KEYS.EDITOR_HEIGHT) ??
        DEFAULTS.EDITOR_SIZE.height,
    },
    isVisible: false,
  }));

  const actions: _Actions = useMemo(
    () => ({
      toggle: () => {
        setState((prev: any) => {
          if (prev.isVisible) {
            return { ...prev, isVisible: false };
          }

          return {
            ...prev,
            isVisible: true,
            position: {
              x:
                settings.getFieldValue(KEYS.EDITOR_X) ??
                DEFAULTS.EDITOR_POSITION.x,
              y:
                settings.getFieldValue(KEYS.EDITOR_Y) ??
                DEFAULTS.EDITOR_POSITION.y,
            },
            size: {
              width:
                settings.getFieldValue(KEYS.EDITOR_WIDTH) ??
                DEFAULTS.EDITOR_SIZE.width,
              height:
                settings.getFieldValue(KEYS.EDITOR_HEIGHT) ??
                DEFAULTS.EDITOR_SIZE.height,
            },
          };
        });
      },

      updateCode: (code: string) => {
        setState((prev: any) => ({ ...prev, code }));

        if (saveTimeout.current) {
          clearTimeout(saveTimeout.current);
        }

        saveTimeout.current = window.setTimeout(() => {
          settings.setFieldValue(KEYS.CSS, code);
        }, 300);
      },

      updateKeybind: (keybind: string) => {
        setState((prev: any) => ({ ...prev, keybind }));
      },

      updateStyles: (styles: _Styles) => {
        setState((prev: any) => ({ ...prev, styles }));
      },

      updatePosition: (position: _Position) => {
        setState((prev: any) => ({ ...prev, position }));
        settings.setFieldValue(KEYS.EDITOR_X, position.x);
        settings.setFieldValue(KEYS.EDITOR_Y, position.y);
      },

      updateSize: (size: _Size) => {
        setState((prev: any) => ({ ...prev, size }));
        settings.setFieldValue(KEYS.EDITOR_WIDTH, size.width);
        settings.setFieldValue(KEYS.EDITOR_HEIGHT, size.height);
      },
    }),
    [settings],
  );

  const styles: _Styles = useMemo(() => {
    return {
      theme: settings.getFieldValue(KEYS.EDITOR_THEME) ?? DEFAULTS.EDITOR_THEME,

      font: {
        size:
          settings.getFieldValue(KEYS.EDITOR_FONT_SIZE) ??
          DEFAULTS.EDITOR_FONT.size,
        family:
          settings.getFieldValue(KEYS.EDITOR_FONT_FAMILY) ??
          DEFAULTS.EDITOR_FONT.family,
      },

      tabSize: String(
        settings.getFieldValue(KEYS.EDITOR_TAB_SIZE) ??
          DEFAULTS.EDITOR_TAB_SIZE,
      ),

      lineHeight: String(
        settings.getFieldValue(KEYS.EDITOR_LINE_HEIGHT) ??
          DEFAULTS.EDITOR_LINE_HEIGHT,
      ),
    };
  }, [settings]);

  const editor: _EditorProps = { state, actions, styles };
  return editor;
};
