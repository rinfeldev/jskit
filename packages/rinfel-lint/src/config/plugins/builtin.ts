import type { EsLintConfigTransform } from "../transform";

export const BuiltinPlugin: EsLintConfigTransform = (config) => {
    config.reportUnusedDisableDirectives = true;

    config.rules = {
        ...config.rules,

        /**
         * @see https://eslint.org/docs/rules/no-cond-assign
         */
        "no-cond-assign": ["error", "except-parens"],

        /**
         * @see https://eslint.org/docs/rules/eqeqeq
         */
        "eqeqeq": ["error", "smart"],
        /**
         * @see https://eslint.org/docs/rules/no-param-reassign
         */
        "no-param-reassign": [
            "warn",
            { props: false },
        ],
        /**
         * @see https://eslint.org/docs/rules/radix
         */
        "radix": ["warn", "as-needed"],

        /**
         * @see https://eslint.org/docs/rules/comma-dangle
         */
        "comma-dangle": [
            "error",
            {
                arrays: "always-multiline",
                objects: "always-multiline",
                imports: "always-multiline",
                exports: "always-multiline",
                functions: "always-multiline",
            },
        ],
        /**
         * @see https://eslint.org/docs/rules/func-names
         */
        "func-names": ["warn", "as-needed"],
        /**
         * @see https://eslint.org/docs/rules/operator-linebreak
         */
        "operator-linebreak": [
            "warn",
            "before",
            {
                overrides: {
                    "=": "ignore",
                    "+=": "ignore",
                    "-=": "ignore",
                },
            },
        ],
        /**
         * @see https://eslint.org/docs/rules/padded-blocks
         */
        "padded-blocks": [
            "warn",
            {
                blocks: "never",
                classes: "always",
                switches: "never",
            },
        ],

        /**
         * @see https://eslint.org/docs/rules/prefer-const
         */
        "prefer-const": [
            "warn",
            { destructuring: "all" },
        ],
    };

    return config;
};
