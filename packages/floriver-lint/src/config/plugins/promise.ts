import type { EsLintConfigTransform } from "../transform";

export const PromisePlugin: EsLintConfigTransform = (config) => {
    config.plugins = [
        ...(config.plugins ?? []),
        "promise",
    ];

    config.extends = [
        ...(Array.isArray(config.extends ??= []) ? config.extends : [config.extends]),
        "plugin:promise/recommended",
    ];

    return config;
};
