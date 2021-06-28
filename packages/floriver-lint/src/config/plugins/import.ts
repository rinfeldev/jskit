import type { EsLintConfigTransform } from "../transform";

export interface ImportPluginOptions {
    readonly projectPaths: string[];
    readonly packageTopLevelPattern?: string;
    readonly internalModuleRegex?: string;
    readonly externalModuleFolders?: string[];
    readonly importPathGroups?: unknown[];
}

export type ImportPlugin = (options: ImportPluginOptions) => EsLintConfigTransform;

export const ImportPlugin: ImportPlugin = (options) => (config) => {
    const {
        projectPaths,
        packageTopLevelPattern = "@/**",
        internalModuleRegex,
        externalModuleFolders = [],
        importPathGroups = [],
    } = options;

    config.plugins = [
        ...(config.plugins ?? []),
        "import",
    ];

    config.extends = [
        ...(Array.isArray(config.extends ??= []) ? config.extends : [config.extends]),
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
    ];

    config.settings = {
        ...config.settings,

        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
                project: projectPaths,
            },
        },

        "import/external-module-folders": [
            "node_modules",
            ...externalModuleFolders,
        ],
        "import/internal-regex": internalModuleRegex,
    };

    config.rules = {
        ...config.rules,

        /**
         * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md
         */
        "import/no-unresolved": "off",
        /**
         * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/named.md
         */
        "import/named": "off",
        /**
         * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/default.md
         */
        "import/default": "off",
        /**
         * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-cycle.md
         */
        "import/no-cycle": "warn",

        /**
         * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/export.md
         */
        "import/export": "off",
        /**
         * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default-member.md
         */
        "import/no-named-as-default-member": "off",

        /**
         * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/first.md
         */
        "import/first": "warn",
        /**
         * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
         */
        "import/order": [
            "warn",
            {
                groups: [
                    "external",
                    "builtin",
                    "internal",
                    "parent",
                    "sibling",
                ],
                pathGroups: [
                    { pattern: packageTopLevelPattern, group: "parent", position: "before" },
                    ...importPathGroups,
                ],
                pathGroupsExcludedImportTypes: [],

                "newlines-between": "ignore",
                alphabetize: {
                    order: "asc",
                    caseInsensitive: true,
                },
            },
        ],
        /**
         * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/newline-after-import.md
         */
        "import/newline-after-import": "warn",
    };

    return config;
};
