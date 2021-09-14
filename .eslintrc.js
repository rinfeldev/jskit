const { EsLintConfig } = require("@rinfel/lint/config");

module.exports = EsLintConfig.root({
    workspaceRootPath: __dirname,
    projectPaths: ["./packages/**/tsconfig.json"],
    packageTopLevelPattern: "@/**",
    internalModuleRegex: "^@rinfel/",
});
