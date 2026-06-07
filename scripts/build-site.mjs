import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(projectRoot, "dist");
const publicFiles = [
  "index.html",
  "styles.css",
  "calculator.js",
  "locale-packs.js",
  "i18n.js",
  "app.js",
];

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

await Promise.all(
  publicFiles.map((file) =>
    cp(resolve(projectRoot, file), resolve(outputDir, file))
  )
);

await writeFile(
  resolve(outputDir, "_headers"),
  `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/*.js
  Cache-Control: public, max-age=0, must-revalidate

/*.css
  Cache-Control: public, max-age=0, must-revalidate
`,
  "utf8"
);

console.log(`Built ${publicFiles.length} public assets in ${outputDir}`);
