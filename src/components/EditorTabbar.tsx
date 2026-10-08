const { React } = Spicetify;
const { useRef } = React;

import { showChangelog } from "../core/utils";
import { formatCode } from "../core/compiler";

import css from "../assets/stylizer.module.scss";

interface MenuItem {
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  divider?: boolean;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export const EditorTabbar = ({ state, actions }: _EditorProps) => {
  const fileInputRef = useRef(null);

  const handleFormat = async () => {
    const formatted = await formatCode(state.code);
    actions.updateCode(formatted);
  };

  const handleOpenFile = () => fileInputRef.current?.click();

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
  };

  const handleSave = () => {
    const blob = new Blob([state.code], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "style.css";
    a.click();
    URL.revokeObjectURL(url);
  };

  const menuConfig: MenuCategory[] = [
    {
      title: "File",
      items: [
        { label: "Open", onClick: handleOpenFile },
        { label: "Save", onClick: handleSave },
        { label: "", divider: true },
        { label: "Exit", onClick: () => actions.toggle() },
      ],
    },
    {
      title: "Edit",
      items: [
        { label: "Format Code", onClick: handleFormat },
      ],
    },
    {
      title: "Themes",
      items: [
        { label: "Work In Progress", disabled: true },
      ],
    },
    {
      title: "Help",
      items: [
        { label: "Issues", href: "https://github.com/woidzero/stylizer/issues" },
        { label: "GitHub", href: "https://github.com/woidzero/stylizer" },
        { label: "Website", href: "https://woid.im/" },
        { label: "", divider: true },
        { label: "Changelog", onClick: () => showChangelog() },
      ],
    },
  ];

  return (
    <div className={css.editor_tabbar}>
      <input
        type="file"
        accept=".css, .scss, .sass"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {menuConfig.map((menu) => (
        <div key={menu.title} className={css.editor_tabbar_item}>
          <details>
            <summary>{menu.title}</summary>

            <div className={css.editor_tabbar_item_content}>
              <ul>
                {menu.items.map((item, index) => {
                  if (item.divider) {
                    return <hr key={index} />;
                  }

                  return (
                    <li
                      key={index}
                      style={{
                        color: item.disabled ? "gray" : undefined,
                        cursor: item.disabled ? "not-allowed" : "pointer",
                      }}
                      onClick={() => {
                        if (item.disabled) return;
                        if (item.onClick) item.onClick();
                        if (item.href) window.open(item.href, "_blank");

                        const details = document.querySelectorAll(`.${css.menu_details}`);
                        details.forEach((d) => d.removeAttribute("open"));
                      }}
                    >
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </details>
        </div>
      ))}
    </div>
  );
};