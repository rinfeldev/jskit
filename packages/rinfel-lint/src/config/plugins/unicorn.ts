import type { EsLintConfigTransform } from "../transform";

export const UnicornPlugin: EsLintConfigTransform = (config) => {
    config.plugins = [
        ...(config.plugins ?? []),
        "unicorn",
    ];

    config.extends = [
        ...(Array.isArray(config.extends ??= []) ? config.extends : [config.extends]),
        "plugin:unicorn/recommended",
    ];

    config.rules = {
        ...config.rules,

        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/better-regex.md
         */
        "unicorn/better-regex": "warn",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-function-scoping.md
         */
        "unicorn/consistent-function-scoping": "off",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/custom-error-definition.md
         */
        "unicorn/custom-error-definition": "warn",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/explicit-length-check.md
         */
        "unicorn/explicit-length-check": [
            "warn",
            { "non-zero": "greater-than-or-equal" },
        ],
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md
         */
        "unicorn/filename-case": [
            "warn",
            {
                cases: {
                    snakeCase: true,
                },
            },
        ],
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-fn-reference-in-iterator.md
         */
        // Use of this rule is not warranted, especially with TypeScript.
        "unicorn/no-array-callback-reference": "off",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-nested-ternary.md
         */
        "unicorn/no-nested-ternary": "warn",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-null.md
         */
        // `null` and `undefined` - while both nullish values - represent different ideas and are also used differently from
        // each other in already existing libraries.
        "unicorn/no-null": "off",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-reduce.md
         */
        // While some `Array#reduce()` code can be refactored into more readable code using other methods, that does not rule
        // its use out. Misuses of `Array#reduce()` are dealt with in PRs.
        "unicorn/no-array-reduce": "off",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-undefined.md
         */
        // TypeScript requires explicitly returning from all code paths, even when the return value is `undefined`.
        "unicorn/no-useless-undefined": "off",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/numeric-separators-style.md
         */
        "unicorn/numeric-separators-style": "off",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-node-protocol.md
         */
        "unicorn/prefer-node-protocol": "off",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prevent-abbreviations.md
         */
        // Common abbreviations are known and readable.
        "unicorn/prevent-abbreviations": "off",
    };

    return config;
};
