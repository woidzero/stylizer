const { React } = Spicetify;
const { useRef, useEffect } = React;

import Draggable from "react-draggable";
import { CodeJar } from "codejar";
import { withLineNumbers } from "codejar-linenumbers";

import Prism from "prismjs";
import "prismjs/components/prism-css";

import { EditorHeader } from "./EditorHeader";
import { EditorTabbar } from "./EditorTabbar";

import { useEditorSettings, useEditorState } from "@hooks/editor";

import { toPx, parsePx } from "@utils/css";
import { registerTheme } from "@utils/theme";

import css from "../assets/stylizer.module.scss";
import "../assets/codejar.css";

export const Editor = () => {
  const settings = useEditorSettings();
  const { state, actions, styles } = useEditorState(settings);

  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const dragRef = useRef(null);
  const jarRef = useRef(null);
  const gutterRef = useRef(null);

  const positionX = parsePx(state.position.x);
  const positionY = parsePx(state.position.y);
  const width = parsePx(state.size.width);
  const height = parsePx(state.size.height);

  useEffect(() => {
    if (!editorRef.current) return;
    registerTheme(styles.theme);

    const highlight = withLineNumbers((editor: HTMLElement) => {
      const code = editor.textContent || "";
      editor.innerHTML = Prism.highlight(code, Prism.languages.css, "css");
    });

    const jar = CodeJar(editorRef.current, highlight, {
      tab: "\t",
      indentOn: /[{([]$/,
      spellcheck: false,
      catchTab: true,
      preserveIdent: true,
      addClosing: true,
      history: true,
    });

    jarRef.current = jar;

    if (state.code) jar.updateCode(state.code);
    jar.onUpdate(actions.updateCode);

    setTimeout(() => {
      const gutter = editorRef.current?.parentElement?.querySelector(
        ".codejar-linenumbers",
      );
      if (gutter instanceof HTMLDivElement) gutterRef.current = gutter;
    }, 100);

    return () => {
      jar.destroy();
      jarRef.current = null;
      gutterRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (jarRef.current && editorRef.current) {
      const currentCode = editorRef.current.textContent || "";
      if (currentCode !== state.code) {
        jarRef.current.updateCode(state.code);
      }
    }
  }, [state.code]);

  useEffect(() => {
    if (!editorRef.current) return;

    const handleScroll = () => {
      if (editorRef.current && gutterRef.current) {
        gutterRef.current.scrollTop = editorRef.current.scrollTop;
      }
    };

    const editor = editorRef.current;
    editor.addEventListener("scroll", handleScroll);

    return () => {
      editor.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.fontSize = styles.font.size;
      editorRef.current.style.fontFamily = styles.font.family;
      editorRef.current.style.tabSize = String(styles.tabSize);
      editorRef.current.style.lineHeight = styles.lineHeight;
    }
  }, [styles.font.size, styles.font.family, styles.tabSize, styles.lineHeight]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === state.toggleKey) {
        e.preventDefault();
        actions.toggle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.toggleKey, actions]);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = width;
    const startHeight = height;

    const onMouseMove = (ev: MouseEvent) => {
      const newWidth = Math.max(300, startWidth + ev.clientX - startX);
      const newHeight = Math.max(200, startHeight + ev.clientY - startY);

      actions.updateSize({
        width: toPx(newWidth),
        height: toPx(newHeight),
      });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  useEffect(() => {
    const wrap = editorRef.current?.parentElement;
    if (!wrap) return;

    const handleScroll = () => {
      if (gutterRef.current) {
        gutterRef.current.scrollTop = wrap.scrollTop;
        console.debug(1);
      }
    };

    wrap.addEventListener("scroll", handleScroll);
    return () => wrap.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const nodes: HTMLElement[] = [];
    let el = editorRef.current as HTMLElement | null;

    while (el) {
      nodes.push(el);
      el = el.parentElement;
    }

    const handlers = nodes.map((node, i) => {
      const h = () => console.log("scroll on", i, node.className);
      node.addEventListener("scroll", h);
      return { node, h };
    });

    return () => {
      handlers.forEach(({ node, h }) => node.removeEventListener("scroll", h));
    };
  }, []);

  return (
    <div
      className={css.stylizer}
      style={
        {
          "--editor-width":
            typeof state.size.width === "string"
              ? state.size.width
              : toPx(state.size.width),
          "--editor-height":
            typeof state.size.height === "string"
              ? state.size.height
              : toPx(state.size.height),
          "--editor-position-x":
            typeof state.position.x === "string"
              ? state.position.x
              : toPx(state.position.x),
          "--editor-position-y":
            typeof state.position.y === "string"
              ? state.position.y
              : toPx(state.position.y),
          "--editor-tab-size": styles.tabSize,
          "--editor-line-height": styles.lineHeight,
          "--editor-font-size": styles.font.size,
          "--editor-font": styles.font.family,
        } as React.CSSProperties
      }
    >
      <style>{state.code}</style>

      <Draggable
        handle="#stylizer_header"
        nodeRef={dragRef}
        position={{ x: positionX, y: positionY }}
        onStop={(_, data) => {
          actions.updatePosition({
            x: toPx(data.x),
            y: toPx(data.y),
          });
        }}
      >
        <div
          ref={(el) => {
            dragRef.current = el;
            containerRef.current = el;
          }}
          className={css.editor + " main-embedWidgetGenerator-container"}
          tabIndex={-1}
          style={{
            display: state.isVisible ? "flex" : "none",
          }}
        >
          <div className={css.editor_content}>
            <div className={css.editor_header} id="stylizer_header">
              <EditorHeader onClose={actions.toggle} />
              <EditorTabbar state={state} actions={actions} styles={styles} />
            </div>

            <div className={css.editor_body} id="stylizer_body">
              <div
                ref={editorRef}
                className={css.editor_codejar}
                style={{
                  fontSize: styles.font.size,
                  fontFamily: styles.font.family,
                  lineHeight: styles.lineHeight,
                  tabSize: styles.tabSize,
                }}
              />
            </div>
          </div>

          <div
            onMouseDown={handleResizeMouseDown}
            style={{
              width: 14,
              height: 14,
              position: "absolute",
              right: 0,
              bottom: 0,
              cursor: "nwse-resize",
              background: "#888",
            }}
          />
        </div>
      </Draggable>
    </div>
  );
};
