import { THEMES } from "../core/settings";

export function registerTheme(name: string) {
  const theme: string = THEMES[name];

  if (!theme) {
    console.warn(`[stylizer] theme "${name}" not found`);
    return;
  }

  const url = "https://cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/" + theme;

  const link = document.createElement("link");
  link.href = url;
  link.rel = "stylesheet";
  link.type = "text/css";

  document.head.appendChild(link);
  console.log(`[stylizer] theme ${name} loaded.`);
  return url;
}
