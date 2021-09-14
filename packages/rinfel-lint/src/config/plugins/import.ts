import type { EsLintConfigTransform } from "../transform";

export interface ImportPluginOptions {
    /**
     * Paths of the projects in the workspace relative to the workspace root. The
     * paths should point to `tsconfig.json` files.
     *
     * **Recommmended**: `["./packages/**​/tsconfig.json"]`
     */
    readonly projectPaths: string[];
    /**
     * Pattern for package top-level imports. In addition to configuring the path
     * mapping in TypeScript's `tsconfig.json`, it should also be configured here
     * for proper import ordering.
     *
     * **Default**: `"@/**"`
     */
    readonly packageTopLevelPattern?: string;
    /**
     * Regex for internal module imports. In a monorepo, internal modules are the
     * modules in packages within the repository. Configure for proper import
     * ordering.
     *
     * **Recommended**: `"^@<workspace>/"`
     */
    readonly internalModuleRegex?: string;
    /**
     * Folder paths of external modules. Configure for proper import ordering.
     *
     * **Default**: `[]` (`"node_modules"` is always included.)
     */
    readonly externalModuleFolders?: string[];
    /**
     * Path groups used to amend import ordering with special rules, e.g.
     * requiring react imports to be at the top of a list of imports.
     *
     * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md#pathgroups-array-of-objects
     */
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
