import type { EsLintConfigTransform } from "../transform";

export const UnicornPlugin: EsLintConfigTransform = (config) => {
    config.plugins = [
        ...(config.plugins ?? []),
        "@rinfel/unicorn",
    ];

    config.extends = [
        ...(Array.isArray(config.extends ??= []) ? config.extends : [config.extends]),
        "plugin:@rinfel/unicorn/recommended",
    ];

    config.rules = {
        ...config.rules,

        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/better-regex.md
         */
        "@rinfel/unicorn/better-regex": "warn",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-function-scoping.md
         */
        "@rinfel/unicorn/consistent-function-scoping": "off",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/custom-error-definition.md
         */
        "@rinfel/unicorn/custom-error-definition": "warn",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/explicit-length-check.md
         */
        "@rinfel/unicorn/explicit-length-check": [
            "warn",
            { "non-zero": "greater-than-or-equal" },
        ],
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md
         */
        "@rinfel/unicorn/filename-case": [
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
        "@rinfel/unicorn/no-array-callback-reference": "off",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-nested-ternary.md
         */
        "@rinfel/unicorn/no-nested-ternary": "warn",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-null.md
         */
        // `null` and `undefined` - while both nullish values - represent different ideas and are also used differently from
        // each other in already existing libraries.
        "@rinfel/unicorn/no-null": "off",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-reduce.md
         */
        // While some `Array#reduce()` code can be refactored into more readable code using other methods, that does not rule
        // its use out. Misuses of `Array#reduce()` are dealt with in PRs.
        "@rinfel/unicorn/no-array-reduce": "off",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-undefined.md
         */
        // TypeScript requires explicitly returning from all code paths, even when the return value is `undefined`.
        "@rinfel/unicorn/no-useless-undefined": "off",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/numeric-separators-style.md
         */
        "@rinfel/unicorn/numeric-separators-style": "off",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-node-protocol.md
         */
        "@rinfel/unicorn/prefer-node-protocol": "off",
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prevent-abbreviations.md
         */
        // Common abbreviations are known and readable.
        "@rinfel/unicorn/prevent-abbreviations": "off",
    };

    return config;
};
