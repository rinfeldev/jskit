# @floriver/kernel

Package implementing a set of core functionalities, like higher-kinded types (HKT), that other packages build upon.

## Usage

> Examples assume a standard [Yarn 2 (Berry)](https://yarnpkg.com) workspace. Adjust all configuration and commands to fit your repository layout.

Add the package to your package's dependencies.

```sh
yarn workspace <package> add @floriver/kernel
```

### Higher-Kinded Types (HKT)

Most type systems, including TypeScript's, support abstracting over types (*with kind of `*`*) as a means of typing generic programs. More advanced type systems also support abstracting over type constructors (*with kind of `k -> k'`*) which allows for typing an extended subset of programs.

`@floriver/kernel` simulates higher-kinded types using a combination of unique placeholder types `_0, _1, ..., _<N>` for instantiating type constructors in a generic way and the substitution operator `$` for applying these type constructors at arbitrary types. In fact, the substitution operator `$` is really just a mechanism to lazily apply type constructor arguments.

See [📄 Higher-Kinded Types (HKT)](docs/hkt.md) for substitution laws, usage examples and more details.

```ts
interface Functor<F> {
    fmap: <A, B>(f: (v: A) => B, x: $<F, [A]>) => $<F, [B]>;
}

const MaybeFunctor: Functor<Maybe<_>> = {
    // fmap :: <A, B>(f: (v: A) => B), x: Maybe<A>) => Maybe<B>
    fmap: (f, x) => { ... },
};
```

```ts
interface Bifunctor<F> {
    bimap: <A, B, C, D>(f: (v: A) => B, g: (v: C) => D, x: $<F, [A, C]>) => $<F, [B, D]>;
    first: <A, B, C>(f: (v: A) => B, x: $<F, [A, C]>) => $<F, [B, C]>;
    second: <A, B, C>(f: (v: B) => C, x: $<F, [A, B]>) => $<F, [A, C]>;
}

const EitherBifunctor: Bifunctor<Either<_0, _1>> = {
    // bimap :: <A, B, C, D>(f: (v: A) => B, g: (v: C) => D, x: Either<A, C>) => Either<B, D>
    bimap: (f, g, x) => { ... },
    // first :: <A, B, C>(f: (v: A) => B, x: Either<A, C>) => Either<B, C>
    first: (f, x) => { ... },
    // second :: <A, B, C>(f: (v: B) => C, x: Either<A, B>) => Either<A, C>
    second: (f, x) => { ... },
};
```

## Hacking

The package consists of a single, top-level module.

As it is the common base dependency of most packages in the repository, it should ideally have no dependencies of its own, including other packages in this repository.

## Contributing

See [📄 `CONTRIBUTING.md` in the repository's root](/CONTRIBUTING.md) for details.
