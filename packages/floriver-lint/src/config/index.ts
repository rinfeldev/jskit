import type { Linter } from "eslint";
import { BuiltinPlugin } from "./plugins/builtin";
import { EsLintCommentsPlugin } from "./plugins/eslint_comments";
import { ImportPlugin } from "./plugins/import";
import { PromisePlugin } from "./plugins/promise";
import { TypeScriptPlugin } from "./plugins/typescript";
import { UnicornPlugin } from "./plugins/unicorn";
import { EsLintConfigTransform } from "./transform";

export interface EsLintConfigOptions {
    readonly workspaceRootPath: string;
    readonly projectPaths: string[];
    readonly packageTopLevelPattern?: string;
    readonly internalModuleRegex?: string;
    readonly externalModuleFolders?: string[];
    readonly importPathGroups?: unknown[];
}

export namespace EsLintConfig {
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
