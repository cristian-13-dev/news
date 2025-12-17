import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";

const eslintConfig = defineConfig({
  extends: [
    ...(Array.isArray(nextVitals.extends) ? nextVitals.extends : []),
    ...(Array.isArray(nextTs.extends) ? nextTs.extends : []),
  ],
  ignorePatterns: [
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
});

export default eslintConfig;
