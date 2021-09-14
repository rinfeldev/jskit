# @rinfel/std

Package implementing a standard library that other packages build upon.

## Usage

> Examples assume a standard [Yarn 2 (Berry)](https://yarnpkg.com) workspace. Adjust all configuration and commands to fit your repository layout.

Add the package to your package's dependencies.

```sh
yarn workspace <package> add @rinfel/std
```

## Hacking

The package consists of a single, top-level module.

As it is the common base dependency of most of our packages, it should ideally have no external dependencies of its own, although it may depend on other packages in this repository.

## Contributing

See [📄 `CONTRIBUTING.md` in the repository's root](/CONTRIBUTING.md) for details.

## License

See [#️⃣ License section of the `README.md` in the repository's root](/README.md#license) for details.
