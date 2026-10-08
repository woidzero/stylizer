import prettier from "prettier/standalone";
import parserPostcss from "prettier/parser-postcss";

let sassCompiler: any = null;

async function loadSass() {
  if (!sassCompiler) {
    sassCompiler = await import("sass");
  }
  return sassCompiler;
}

export async function compileScss(scssCode: string): Promise<{ css: string; error?: string }> {
  try {
    const sass = await loadSass();
    const result = sass.compileString(scssCode);
    return { css: result.css };
  } catch (err: any) {
    return { css: scssCode, error: err.message || "error compiling sass" };
  }
}

export async function formatCode(code: string): Promise<string> {
  try {
    return await prettier.format(code, {
      parser: "scss",
      plugins: [parserPostcss],
      tabWidth: 2,
      useTabs: false,
    });
  } catch (err) {
    console.error("[stylizer] prettier formatting error:", err);
    return code;
  }
}