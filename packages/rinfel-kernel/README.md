# @rinfel/kernel

Package implementing a set of core functionalities, like higher-kinded types (HKT) and an object model, that other packages build upon.

## Usage

> Examples assume a standard [Yarn 2 (Berry)](https://yarnpkg.com) workspace. Adjust all configuration and commands to fit your repository layout.

Add the package to your package's dependencies.

```sh
yarn workspace <package> add @rinfel/kernel
```

### Higher-Kinded Types (HKT)

Most type systems, including TypeScript's, support abstracting over types (*with kind of `*`*) as a means of typing generic programs. More advanced type systems also support abstracting over type constructors (*with kind of `k -> k'`*) which allows for typing an extended subset of programs.

`@rinfel/kernel` simulates higher-kinded types using a combination of unique placeholder types `_0, _1, ..., _<N>` for instantiating type constructors in a generic way and the substitution operator `$` for applying these type constructors at arbitrary types. In fact, the substitution operator `$` is really just a mechanism to lazily apply type constructor arguments.

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

### Object Model

`@rinfel/kernel`'s object model is a framework for creating extensible types using pure functions, while maintaining natural syntax, without relying on JavaScript's quasi-OOP features. It is by nature an opinionated way of writing types and is meant to be used by libraries and application models rather than for web APIs and DTOs. It is inspired by Rust's `impl` blocks and uses a model similar to Rust's traits for implementing common functionality and extending the behavior of existing types.

See [📄 Object Model](docs/object_model.md) for more details.

#### Example Type and Trait Declarations

Declare the `Eq` trait for defining equivalence relationships.

```ts
import { _, Trait } from "@rinfel/kernel";

export namespace Eq {
    namespace symbols {
        export const trait = Symbol("Eq");

        export const equals = Symbol("Eq.equals");
    }

    export const trait = Trait(symbols.trait, {
        equals: Trait.Property(symbols.equals).decl<(other: _) => boolean>(),
    });

    export type Equals<T> = (self: T, other: T) => boolean;
}
```

Declare a `Point` type with methods and an implementation for the `Eq` trait.

```ts
import { Meta, SelfFunction } from "@rinfel/kernel";
import { Eq } from "./eq";

export interface Point extends Meta.Object<Point, Point.Properties> {
    readonly x: number;
    readonly y: number;
}

export function Point(x: number, y: number): Point {
    return Point.meta.createObject({
        x,
        y,
    });
}

export namespace Point {
    export interface Properties {
        readonly negate: () => Point;
        readonly add: (other: Point) => Point;
        readonly scale: (n: number) => Point;
    }

    export const meta = Meta<Point, Properties>("Point");
}

export namespace Point {
    export function negate(self: Point): Point {
        return Point(-self.x, -self.y);
    }

    export function add(self: Point, other: Point): Point {
        return Point(self.x + other.x, self.y + other.y);
    }

    export function scale(self: Point, n: number): Point {
        return Point(n * self.x, n * self.y);
    }
}

Point.meta.impl({
    negate: SelfFunction.bindSelf(Point.negate),
    add: SelfFunction.bindSelf(Point.add),
    scale: SelfFunction.bindSelf(Point.scale),
});

export namespace Point {
    export const equals: Eq.Equals<Point> = (self, other) => {
        return self.x === other.x
            && self.y === other.y;
    };
}

Point.meta.implTrait(Eq, {
    equals: SelfFunction.bindSelf(Point.equals),
});
```

## Hacking

The package consists of a single, top-level module.

As it is the common base dependency of most packages in the repository, it should ideally have no dependencies of its own, including other packages in this repository.

## Contributing

See [📄 `CONTRIBUTING.md` in the repository's root](/CONTRIBUTING.md) for details.
