import { search, searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { lintGutter, linter, Diagnostic } from "@codemirror/lint";
import { keymap } from "@codemirror/view";

const cssLinter = linter((view) => {
  const diagnostics: Diagnostic[] = [];
  const doc = view.state.doc.toString();

  let openBraces = 0;
  for (let i = 0; i < doc.length; i++) {
    if (doc[i] === "{") openBraces++;
    if (doc[i] === "}") {
      openBraces--;
      if (openBraces < 0) {
        diagnostics.push({
          from: i,
          to: i + 1,
          severity: "error",
          message: "unexpected '}'",
        });
        openBraces = 0;
      }
    }
  }

  if (openBraces > 0) {
    diagnostics.push({
      from: Math.max(0, doc.length - 1),
      to: doc.length,
      severity: "error",
      message: `unclosed braces: ${openBraces}`,
    });
  }

  return diagnostics;
});

export const getEditorExtensions = () => [
  search({ top: true }),
  highlightSelectionMatches(),
  keymap.of(searchKeymap),
  lintGutter(),
  cssLinter,
];