// oxlint-disable no-unused-vars
const { React } = Spicetify;
const { useState, useRef, useEffect } = React;

import { showChangelog } from "@/utils/settings";
import css from "../assets/stylizer.module.scss";

export const EditorTabbar = ({ state, actions }: _EditorProps) => {
  const [openMenu, setOpenMenu] = useState(null);
  const barRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleOpen = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      actions.updateCode(text);
    };
    reader.readAsText(file);

    e.target.value = "";
    setOpenMenu(null);
  };

  const handleSave = () => {
    const blob = new Blob([state.code], { type: "text/css" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "style.css";
    a.click();
    URL.revokeObjectURL(url);

    setOpenMenu(null);
  };

  return (
    <div ref={barRef} className={css.editor_tabbar}>
      <input
        type="file"
        accept=".css"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div className={css.editor_tabbar_item}>
        <span onClick={() => toggleMenu("file")}>File</span>

        {openMenu === "file" && (
          <div className={css.editor_tabbar_item_content}>
            <ul>
              <li id="stt_tabbar_open" onClick={handleOpen}>
                Open
              </li>
              <li id="stt_save" onClick={handleSave}>
                Save
              </li>
              <hr />
              <li
                id="stt_tabbar_exit"
                onClick={() => {
                  actions.toggle();
                }}
              >
                Exit
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className={css.editor_tabbar_item}>
        <span onClick={() => toggleMenu("preferences")}>Preferences</span>

        {openMenu === "preferences" && (
          <div className={css.editor_tabbar_item_content}>
            <ul>
              <li
                id="stt_tabbar_theme"
                style={{
                  color: "gray",
                  display: "flex",
                  gap: 5,
                }}
              >
                Theme <span style={{ display: "inline-block" }}>(WIP)</span>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className={css.editor_tabbar_item}>
        <span onClick={() => toggleMenu("help")}>Help</span>

        {openMenu === "help" && (
          <div className={css.editor_tabbar_item_content}>
            <ul>
              <li id="stt_tabbar_github">
                <a target="_blank" href="https://github.com/woidzero/stylizer">
                  GitHub
                </a>
              </li>
              <li id="stt_tabbar_github">
                <a target="_blank" href="https://discord.woid.world/">
                  Discord
                </a>
              </li>
              <hr />
              <li id="stt_tabbar_github" onClick={() => showChangelog()}>
                Changelog
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
