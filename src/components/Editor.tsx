const { React } = Spicetify;
const { useState, useEffect, useRef } = React;

import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";

import { css as cssLang } from "@codemirror/lang-css";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";

import { useEditorSettings, useEditorState } from "../core/editor";
import { getEditorExtensions } from "../core/extensions";
import { compileScss } from "../core/compiler";

import { EditorHeader } from "./EditorHeader";
import { EditorTabbar } from "./EditorTabbar";

import { PiPPortal, usePiPWindow } from "./PiPPortal";

import css from "../assets/stylizer.module.scss";

export const Editor = () => {
  const settings = useEditorSettings();
  const { state, actions, styles } = useEditorState(settings);
  const { pipWindow } = usePiPWindow();

  const isInternalChange = useRef(false);

  const [containerEl, setContainerEl] = useState(null);
  const viewRef = useRef(null);

  const [compiledCss, setCompiledCss] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const processCode = async () => {
      const { css: resultCss } = await compileScss(state.code);

      if (isCurrent) {
        setCompiledCss(resultCss);
      }
    };

    const timer = setTimeout(processCode, 150);
    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [state.code]);

  useEffect(() => {
    if (!state.isVisible || !containerEl) return;

    const view = new EditorView({
      doc: state.code,
      extensions: [
        basicSetup,
        cssLang(),
        oneDark,
        keymap.of([indentWithTab]),
        ...getEditorExtensions(),
        EditorView.theme({
          "&": {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            borderRadius: "12px",
          },
          ".cm-scroller": {
            borderRadius: "12px",
            overflow: "auto",
            flex: 1
          },
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            isInternalChange.current = true;
            actions.updateCode(update.state.doc.toString());
          }
        }),
      ],
      parent: containerEl,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [state.isVisible, containerEl]);

  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    if (viewRef.current) {
      const currentCode = viewRef.current.state.doc.toString();
      if (currentCode !== state.code) {
        viewRef.current.dispatch({
          changes: { from: 0, to: currentCode.length, insert: state.code },
        });
      }
    }
  }, [state.code]);

  useEffect(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === state.toggleKey || e.code === state.toggleKey) {
        e.preventDefault();
        e.stopPropagation();
        actions.toggle();
      }
    };

    const handlePiPKeyDown = (e: KeyboardEvent) => {
      if (e.key === state.toggleKey || e.code === state.toggleKey) {
        e.preventDefault();
        e.stopPropagation();
        pipWindow?.close();
      }
    };

    const handleToggle = () => actions.toggle();

    window.addEventListener("stylizer:toggle", handleToggle);
    window.addEventListener("keydown", handleWindowKeyDown, { capture: true });

    if (pipWindow) {
      pipWindow.addEventListener("keydown", handlePiPKeyDown, { capture: true });
    }

    return () => {
      window.removeEventListener("stylizer:toggle", handleToggle);
      window.removeEventListener("keydown", handleWindowKeyDown, { capture: true });

      if (pipWindow) {
        pipWindow.removeEventListener("keydown", handlePiPKeyDown, { capture: true });
      }
    };
  }, [state.toggleKey, actions, pipWindow]);

  return (
    <>
      <style id="stylizer-user-css">{compiledCss}</style>

      <PiPPortal
        isOpen={state.isVisible}
        onClose={actions.toggle}
        width={parseInt(state.size.width)}
        height={parseInt(state.size.height)}
      >
        <div className={css.editor_content}>
          <div className={css.editor_header}>
            <EditorHeader onClose={actions.toggle} />
            <EditorTabbar state={state} actions={actions} styles={styles} />
          </div>
          <div
            className={css.editor_body}
            ref={setContainerEl}
            style={{
              fontSize: styles.font.size,
              fontFamily: styles.font.family,
            }} />
        </div>
      </PiPPortal>
    </>
  );
};