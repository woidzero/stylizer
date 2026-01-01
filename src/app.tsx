const { React, ReactDOM } = Spicetify;
import { Editor } from "./components/Editor";

import { KEYS, setupSettings, showChangelog } from "./utils/settings";
import { __VERSION__, __CHANGELOG__ } from "./generated/meta";

async function main() {
  let body;

  while (true) {
    body = document.querySelector("body");

    if (Spicetify?.Platform?.History && body) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const settings = setupSettings();
  settings.pushSettings();

  let editorRoot = document.getElementById("stylizer__root");
  if (!editorRoot) {
    editorRoot = document.createElement("div");
    editorRoot.id = "stylizer__root";

    body.prepend(editorRoot);

    ReactDOM.render(<Editor />, editorRoot);
    console.debug("[stylizer] editor rendered");
  }

  if (settings.getFieldValue(KEYS.VERSION) !== __VERSION__) {
    showChangelog();
    settings.setFieldValue(KEYS.VERSION, __VERSION__);
  }
}

export default main;
