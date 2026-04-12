const { React, ReactDOM } = Spicetify;
import { Editor } from "./components/Editor";

import { KEYS, settings } from "./core/settings";
import { showChangelog } from "./core/utils";

import { __VERSION__, __CHANGELOG__ } from "./generated/meta";

export default async function main() {
  let body;

  while (true) {
    body = document.querySelector("body");

    if (Spicetify?.Platform?.History && body) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

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

main();
