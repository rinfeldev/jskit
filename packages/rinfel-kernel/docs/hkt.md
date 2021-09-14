# Higher-Kinded Types (HKT)

## Overview

Most type systems, including TypeScript's, support abstracting over types (*with kind of `*`*) as a means of typing generic programs. More advanced type systems also support abstracting over type constructors (*with kind of `k -> k'`*) which allows for typing an extended subset of programs.

TypeScript has [no built-in language support for higher-kinded types yet](https://github.com/microsoft/TypeScript/issues/1213). While type constructors may be statically declared, they must always be instantiated before use. Despite this, various attempts have been made to simulate higher-kinded types in the language (most notably [fp-ts](https://github.com/gcanti/fp-ts)). These typically use an [identifier-based mechanism](https://github.com/gcanti/fp-ts/blob/master/docs/guides/HKT.md), where the type constructor is represented by a unique identifier alongside its type arguments (`HKT[N]<Id, A, B, ...>`) and a mapping is provided between it and the desired type (`T<A, B, ...>`).

`@rinfel/kernel` uses an alternative, arguably more simplified approach to simulating higher-kinded types. For type constructor `T<A, B, ...>`, if we instantiate the type with unique placeholder types `_0, _1, ...`, resulting in `T<_0, _1, ...>`, then, if we can substitute all instances of the placeholder types `_0, _1, ...` each, we effectively have the ability to use `T<_0, _1, ...>` as a type constructor and apply it at arbitrary types, thus abstracting over the type constructor `T`. We can define such a generic substitution operator `$<T, S>` using TypeScript's mapped types.

Unlike previous approaches, which used identifiers to represent type constructors, we use unique identifiers to represent the type parameters of type constructors. This has the benefit of not needing to specialize the implementation of the substitution operator for every type constructor we might use. The substitution operator `$` works the same for `T1<_0>`, `T2<_0, _1, _2>` and even `(arg0: _0, arg1: _1, arg2: _2, arg3: _3) => _4`. In fact, the substitution operator `$` is really just a mechanism to lazily apply type constructor arguments. For all type constructors `T` with arity `N`, it holds that `T<S0, S1, S2, ..., S[N]> ≡ $<T<_0, _1, _2, ..., _<N>>, [S0, S1, S2, ..., S[N]]>`.

## Usage

Since abstracting over types is built into TypeScript, `@rinfel/kernel`'s higher-kinded types are concerned with abstracting over N-ary type constructors.

### Abstracting over Unary Type Constructors

In this example, we implement functors based on Haskell's `Functor` type class.

```hs
class Functor f where
    fmap :: (a -> b) -> f a -> f b
```

**If** TypeScript had native higher-kinded types, the equivalent `Functor` interface might look like this:

```ts
interface Functor<F<_>> {
    fmap: <A, B>(f: (v: A) => B, x: F<A>) => F<B>;
}
```

With `@rinfel/kernel`'s higher-kinded types, `Functor` can be represented like this:

```ts
interface Functor<F> {
    fmap: <A, B>(f: (v: A) => B, x: $<F, [A]>) => $<F, [B]>;
}
```

Then, an instance of `Functor` for a `Maybe` type would look like this:

```ts
const MaybeFunctor: Functor<Maybe<_>> = {
    // fmap :: <A, B>(f: (v: A) => B), x: Maybe<A>) => Maybe<B>
    fmap: (f, x) => { ... },
};
```

> Note the use of `_` when instantiating an abstract instance of the `Maybe` type constructor. `_` is a convenience alias for `_0` which itself is an alias for `_<0>`.

### Abstracting over Type Constructors of Higher Arity

You may have noticed in the above example that the substitution operator `$` takes a tuple of substitution types as its second parameter. The unique placeholder types `_0 (or _<0>), _1 (or _<1>), ..., _9 (or _<9>), _<10>, _<11>, ..., _<N>` correspond to their respective item in the substitution tuple: `$<T, S>` replaces all instances of `_0` with `S[0]`, `_1` with `S[1]`, `_<N>` with `S[N]` in `T`.

In this example, we implement bifunctors based on a Haskell `Bifunctor` type class.

```hs
class Bifunctor f where
    bimap :: (a -> b) -> (c -> d) -> f a c -> f b d
    first :: (a -> b) -> f a c -> f b c
    second :: (b -> c) -> f a b -> f a c
```

**If** TypeScript had native higher-kinded types, the equivalent `Bifunctor` interface might look like this:

```ts
interface Bifunctor<F<_, _>> {
    bimap: <A, B, C, D>(f: (v: A) => B, g: (v: C) => D, x: F<A, C>) => F<B, D>;
    first: <A, B, C>(f: (v: A) => B, x: F<A, C>) => F<B, C>;
    second: <A, B, C>(f: (v: B) => C, x: F<A, B>) => F<A, C>;
}
```

With `@rinfel/kernel`'s higher-kinded types, `Bifunctor` can be represented like this:

```ts
interface Bifunctor<F> {
    bimap: <A, B, C, D>(f: (v: A) => B, g: (v: C) => D, x: $<F, [A, C]>) => $<F, [B, D]>;
    first: <A, B, C>(f: (v: A) => B, x: $<F, [A, C]>) => $<F, [B, C]>;
    second: <A, B, C>(f: (v: B) => C, x: $<F, [A, B]>) => $<F, [A, C]>;
}
```

Then, an instance of `Bifunctor` for an `Either` type would look like this:

```ts
const EitherBifunctor: Bifunctor<Either<_0, _1>> = {
    // bimap :: <A, B, C, D>(f: (v: A) => B, g: (v: C) => D, x: Either<A, C>) => Either<B, D>
    bimap: (f, g, x) => { ... },
    // first :: <A, B, C>(f: (v: A) => B, x: Either<A, C>) => Either<B, C>
    first: (f, x) => { ... },
    // second :: <A, B, C>(f: (v: B) => C, x: Either<A, B>) => Either<A, C>
    second: (f, x) => { ... },
};
```

### Fixing Type Parameters of Type Constructors

There are various use cases for fixing some type parameters of type constructors and only leaving the rest for substitution. This is easy enough since the substitution operator `$` only deals with the placeholder types `_0, _1, ..., _<N>` and their substitutions `[S[0], S[1], ..., S[N]]` and leaves any other type *functionally* unaltered. Note that non-substituted types are still visited by the substitution operator `$`. In most cases, this has no implications as the types are left structurally unaltered and TypeScript resolves them back to their original representations, but if you are dealing with exceptionally deep or potentially recursive types, TypeScript might not resolve it back to the original type and may instead display the partially remapped type instead. The equivalence guarantees still hold in this case, it is only the representation of the type that is mangled. For this case, the offending types `T` can be wrapped in `Fixed<T>` before substitution which will tell the substitution operator to not recurse into that instance of `T`. For all types `T`, it holds that `Fixed<T> ≢ T` and that `$<Fixed<T>, S> ≡ T`, where `S` is any valid tuple.

In this example, we implement left and right functors for an `Either` type. Instances of the previously declared `Functor` interface would look like this:

```ts
const EitherLeftFunctor = <R>(): Functor<Either<_, R>> => {
    // fmap :: <A, B>(f: (v: A) => B), x: Either<A, R>) => Either<B, R>
    fmap: (f, x) => { ... },
};

const EitherRightFunctor = <L>(): Functor<Either<L, _>> => {
    // fmap :: <A, B>(f: (v: A) => B), x: Either<L, A>) => Either<L, B>
    fmap: (f, x) => { ... },
};
```

As discussed above, if the fixed type parameters in the resulting types are mangled, they can be wrapped in `Fixed<T>` to resolve the issue:

```ts
const EitherLeftFunctor = <R>(): Functor<Either<_, Fixed<R>>> => {
    // fmap :: <A, B>(f: (v: A) => B), x: Either<A, R>) => Either<B, R>
    fmap: (f, x) => { ... },
};

const EitherRightFunctor = <L>(): Functor<Either<Fixed<L>, _>> => {
    // fmap :: <A, B>(f: (v: A) => B), x: Either<L, A>) => Either<L, B>
    fmap: (f, x) => { ... },
};
```
