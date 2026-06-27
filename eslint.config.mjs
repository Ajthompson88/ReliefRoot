import js from "@eslint/js";
import typescript from "typescript-eslint";

export default [
    js.configs.recommended,
    ...typescript.configs.recommended,
    {
        ignores: ["node_modules/", "dist/", "build", "coverage"],
    },
];
