import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/main.js"],
  bundle: true,
  outfile: "main.js",
  platform: "browser",
  format: "cjs",
  external: ["obsidian"],
  sourcemap: false,
  target: "es2020",
  logLevel: "info",
});
