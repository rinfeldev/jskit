import type { Linter } from "eslint";
import { BuiltinPlugin } from "./plugins/builtin";
import { EsLintCommentsPlugin } from "./plugins/eslint_comments";
import { ImportPlugin } from "./plugins/import";
import { PromisePlugin } from "./plugins/promise";
import { TypeScriptPlugin } from "./plugins/typescript";
import { UnicornPlugin } from "./plugins/unicorn";
import { EsLintConfigTransform } from "./transform";

/**
 * Options to customize the ESLint config according to the layout of the
 * workspace.
 */
export interface EsLintConfigOptions {
    /**
     * Path of the workspace root. All project paths are relative to the workspace
     * root and have to be contained in it.
     *
     * **Recommended**: `__dirname`
     */
    readonly workspaceRootPath: string;
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

export namespace EsLintConfig {
    /**
     * Generate root ESLint config.
     */
    export const root = (options: EsLintConfigOptions): Linter.Config => {
        const {
            workspaceRootPath,
            projectPaths,
            packageTopLevelPattern,
            internalModuleRegex,
            externalModuleFolders,
            importPathGroups,
        } = options;

        const baseConfig: Linter.Config = {
            root: true,

            env: {
                node: true,
                browser: true,
            },
        };

        const transforms = EsLintConfigTransform.chain([
            BuiltinPlugin,
            EsLintCommentsPlugin,
            TypeScriptPlugin({
                workspaceRootPath,
                projectPaths,
            }),
            ImportPlugin({
                projectPaths,
                packageTopLevelPattern,
                internalModuleRegex,
                externalModuleFolders,
                importPathGroups,
            }),
            PromisePlugin,
            UnicornPlugin,
        ]);

        return transforms(baseConfig);
    };
}
