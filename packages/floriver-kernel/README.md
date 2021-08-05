# @floriver/kernel

Package implementing a set of core functionalities that other packages build upon.

## Usage

> Examples assume a standard [Yarn 2 (Berry)](https://yarnpkg.com) workspace. Adjust all configuration and commands to fit your repository layout.

Add the package to your package's dependencies.

```sh
yarn workspace <package> add @floriver/kernel
```

## Hacking

The package consists of a single, top-level module.

As it is the common base dependency of most packages in the repository, it should ideally have no dependencies of its own, including other packages in this repository.

## Contributing

See [📄 `CONTRIBUTING.md` in the repository's root](/CONTRIBUTING.md) for details.
