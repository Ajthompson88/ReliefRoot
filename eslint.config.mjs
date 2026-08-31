import js from "@eslint/js";
import typescript from "typescript-eslint";

export default [
    {
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "**/build/**",
            "**/coverage/**",
            "generated/**",
        ],
    },

    js.configs.recommended,

    ...typescript.configs.recommended,
];
