interface _Size {
  width: string;
  height: string;
}

interface _Position {
  x: string;
  y: string;
}

interface _EditorProps {
  state: _State;
  actions: _Actions;
  styles: _Styles;
}

interface _Styles {
  theme: string;
  tabSize: number;
  lineHeight: string;
  font: {
    size: string;
    family: string;
  };
}

interface _State {
  code: string;
  isVisible: boolean;
  isFocused: boolean;
  toggleKey: string;
  position: _Position;
  size: _Size;
}

interface _Actions {
  toggle: () => void;
  updateCode: (code: string) => void;
  updateKeybind: (keybind: string) => void;
  updatePosition: (position: _Position) => void;
  updateStyles: (styles: _Styles) => void;
  updateSize: (size: _Size) => void;
}
