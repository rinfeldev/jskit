import type { EsLintConfigTransform } from "../transform";

export const EsLintCommentsPlugin: EsLintConfigTransform = (config) => {
    config.plugins = [
        ...(config.plugins ?? []),
        "eslint-comments",
    ];

    config.extends = [
        ...(Array.isArray(config.extends ??= []) ? config.extends : [config.extends]),
        "plugin:eslint-comments/recommended",
    ];

    config.rules = {
        ...config.rules,

        "eslint-comments/disable-enable-pair": [
            "error",
            { allowWholeFile: true },
        ],
    };

    return config;
};
