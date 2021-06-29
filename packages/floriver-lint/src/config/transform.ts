import type { Linter } from "eslint";

export type EsLintConfigTransform =
    (config: Linter.Config) => Linter.Config;

export namespace EsLintConfigTransform {
    export type Chain = (transforms: EsLintConfigTransform[]) => EsLintConfigTransform;

    export const chain: Chain = (transforms) => (config) => {
        return transforms.reduce((currentConfig, transform) => transform(currentConfig), config);
    };
}
