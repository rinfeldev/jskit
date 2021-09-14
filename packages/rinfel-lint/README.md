# @rinfel/lint

Package for linting-related code and configurations to ensure source quality and a consistent code style.

## Usage

> Examples assume a standard [Yarn 2 (Berry)](https://yarnpkg.com) workspace. Adjust all configuration and commands to fit your repository layout.

Add the package and all of its peer dependencies to your development dependencies:

```sh
yarn add --dev \
    @rinfel/lint \
    eslint \
    @typescript-eslint/parser \
    @typescript-eslint/eslint-plugin \
    eslint-plugin-eslint-comments \
    eslint-plugin-import \
    eslint-import-resolver-typescript \
    eslint-plugin-promise \
    eslint-plugin-unicorn
```

Configure ESLint to use `@rinfel/lint`'s configuration by adding the following to your workspace's `.eslintrc.js`:

```js
const { EsLintConfig } = require("@rinfel/lint/config");

module.exports = EsLintConfig.root({
    workspaceRootPath: __dirname,
    projectPaths: ["./packages/**/tsconfig.json"],
    packageTopLevelPattern: "@/**",
    internalModuleRegex: "^@example/",
});
```

[Adjust configuration](#options) as needed. It is also recommended to add the following listings to your `.eslintignore`:

```
**/node_modules
**/dist
**/.eslintrc.js
**/*.config.js
```

### Options

#### `workspaceRootPath`

Path of the workspace root. All project paths are relative to the workspace root and have to be contained in it.

**Recommended**: `__dirname`

#### `projectPaths`

Paths of the projects in the workspace relative to the workspace root. The paths should point to `tsconfig.json` files.

**Recommmended**: `["./packages/**​/tsconfig.json"]`

#### `packageTopLevelPattern`

Pattern for package top-level imports. In addition to configuring the path mapping in TypeScript's `tsconfig.json`, it should also be configured here for proper import ordering.

**Default**: `"@/**"`

#### `internalModuleRegex`

Regex for internal module imports. In a monorepo, internal modules are the modules in packages within the repository. Configure for proper import ordering.

**Recommended**: `"^@<workspace>/"`

#### `externalModuleFolders`

Folder paths of external modules. Configure for proper import ordering.

**Default**: `[]` (`"node_modules"` is always included.)

#### `importPathGroups`

Path groups used to amend import ordering with special rules, e.g. requiring react imports to be at the top of a list of imports.

See https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md#pathgroups-array-of-objects

## Hacking

The package consists of the following modules, each covering a certain aspect of linting.

### `@rinfel/lint/config`

Modern ESLint config made up of individually configurable plugins.

Plugins configure/implement rules related to certain aspects of linting. Each plugin is a function that transforms a given input ESLint config into another, called an `EsLintConfigTransform`. Plugins are chained together into a pipeline to generate the ESLint config (see `EsLintConfigTransform.chain`).

The top-level API is `EsLintConfig.root` which generates our root ESLint config. Any config, including the root config, can be extended with further plugins:

```js
const { EsLintConfig } = require("@rinfel/lint/config");
const { EsLintConfigTransform } = require("@rinfel/lint/config/transform");

const MyCustomPlugin = (config) => {
    return config;
};

const MyConfigurablePlugin = (options) => (config) => {
    return config;
};

const baseConfig = EsLintConfig.root({
    workspaceRootPath: __dirname,
    projectPaths: ["./packages/**/tsconfig.json"],
    packageTopLevelPattern: "@/**",
    internalModuleRegex: "^@example/",
});

const transforms = EsLintConfigTransform.chain([
    MyCustomPlugin,
    MyConfigurablePlugin({ ... }),
]);

const myConfig = transforms(baseConfig);
module.exports = myConfig;
```

## Contributing

See [`CONTRIBUTING.md` in the repository's root](/CONTRIBUTING.md) for details.
