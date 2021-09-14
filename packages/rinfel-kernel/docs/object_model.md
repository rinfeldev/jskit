# Object Model

## Overview

`@rinfel/kernel`'s object model is a framework for creating extensible types using pure functions, while maintaining natural syntax, without relying on JavaScript's quasi-OOP features. It is by nature an opinionated way of writing types and is meant to be used by libraries and application models rather than for web APIs and DTOs. It is inspired by Rust's `impl` blocks and uses a model similar to Rust's traits for implementing common functionality and extending the behavior of existing types.

## `Meta`

Types declared with the object model all have a `Meta` object which handles object instantiation, property implementation, type introspection and more, and maintains the underlying JavaScript `prototype`.

By convention, all types have a public `<type>.meta` accessor to their `Meta` object which provides the following accessors:
* **`Meta#name`**: Name of the type used when constructing this `Meta` object. Displayed as a type name in V8 and some other JavaScript engines.
* **`Meta#impl`**: Implements the type's own properties with the given implementation object.
* **`Meta#implTrait`**: Implements the given trait's properties on the type with the given implementation object, see [#️⃣ Trait Implementations](#trait-implementations).
* **`Meta#implements`**: Whether the type implements the given trait, see [#️⃣ Traits](#traits).
* **`Meta#createObject`**: Instantiates an object which is bound to this `Meta` object.

All type instances have access to their type's `Meta` object through `<type_instance>.meta`, and can access a set of meta helpers, see [#️⃣ Consuming Traits](#consuming-traits).

### Type Declarations

*Type declarations take the following form:*

First, the type of the object, the type of its shared properties and the `<type>.meta` accessor is declared. The name of the type, the type of `Self` and the type of its instance's shared properties are used in the `Meta` constructor. The value type extends `Meta.Object<Self, Properties>` for proper TypeScript typing.

```ts
import { Meta } from "@rinfel/kernel";

export interface Point extends Meta.Object<Point, Point.Properties> {
    readonly x: number;
    readonly y: number;
}

export namespace Point {
    export interface Properties {
        readonly negate: () => Point;
        readonly add: (other: Point) => Point;
        readonly scale: (n: number) => Point;
    }

    export const meta = Meta<Point, Properties>("Point");
}
```

Declare constructor functions using the `<type>.meta.createObject` function. The instantiated object will be bound to the type's `Meta` object and will have the same values as the given object.

```ts
// NOTE: Place before first namespace declaration. This is a TypeScript requirement.
export function Point(x: number, y: number): Point {
    return Point.meta.createObject({
        x,
        y,
    });
}
```

Declare the type's own properties and bind them to the type's `Meta` object using `<type>.meta.impl`.

By convention, self functions are used which are functions with their first, `self` argument marking the current receiver. `SelfFunction.bindSelf` can be used to transpose the function into a JavaScript method, a function with a `this` argument.

```ts
// NOTE: Merge with existing import of `@rinfel/kernel`.
import { SelfFunction } from "@rinfel/kernel";

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
```

More complex types can also be represented, like discriminated unions:

```ts
import { Meta } from "@rinfel/kernel";

export type Shape =
    | Shape.Triangle
    | Shape.Rectangle
    | Shape.Circle
    ;

export namespace Shape {
    export interface Properties {
        ...
    }

    export const meta = Meta<Shape, Properties>("Shape");

    export enum Kind {
        Triangle = "Triangle",
        Rectangle = "Rectangle",
        Circle = "Circle",
    }

    export interface Triangle extends Meta.Object<Shape, Properties> {
        readonly kind: Kind.Triangle;
        ...
    }

    export function Triangle(...): Triangle {
        return meta.createObject({
            kind: Kind.Triangle,
            ...
        } as const);
    }

    ...
}

...
```

### Hydration

When introspecting objects of `unknown` type, it is difficult to safely access properties common to instances of object model types. The `Meta` namespace provides helpers for interacting with objects that may be instances of object model types.

#### `Meta.fetch`

Retrieves the `Meta` object of the type of the given object if it is an instance of an object model type.

```ts
declare const obj: unknown;

Meta.fetch(obj)?.name;
```

#### `Meta.hydrate`

Type guard which hydrates the type of an unknown object with properties common to instances of object model types if it is one.

```ts
declare const obj: unknown;

if (Meta.hydrate(obj) && obj.is(Eq))
    obj.as(Eq).equals({ value: 12 });
```

## Traits

Inspired by [Rust's similar language feature with the same name](https://doc.rust-lang.org/book/ch10-02-traits.html) &mdash; traits are used for declaring and implementing common functionality, and extending the behavior of existing types safely.

### Trait Declarations

*Trait declarations take the following form:*

> **Note**: The following example declaration uses the namespace style. This is highly recommended, but not required. Traits may be declared solely through a set of symbols and a trait object declaration. However, the namespace style allows trait authors to add additional members to their traits besides types, like helper functions and [#️⃣ auto-implementations](#auto-implementations). A namespace containing a trait property and the trait itself are interchangeable in calls requiring a `Traitlike`, meaning that there is no need to explicitly refer to the trait object in the namespace style using `<trait>.trait`.

First, symbols are defined for the trait and each of its properties. Symbol accessors make it possible to safely extend existing types with new behavior.

Note the forward declaration of symbols. This is a TypeScript requirement for proper typing.

```ts
export namespace Eq {
    namespace symbols {
        export const trait = Symbol("Eq");

        export const equals = Symbol("Eq.equals");
    }
```

Traits are defined using the `Trait(<symbol>)` constructor function. Each property has a name available in the trait's scope and a symbol used for global references. A property is defined through its property descriptor using `Trait.Property(<symbol>).decl<<type>>()`.

In the namespace style, the trait object must be assigned to the `trait` property of the trait namespace.

Also note the use of the `_` placeholder type. In this context, `_` represents the type of the receiver, `Self`, and will be substituted for it in implementations of the trait. This is the same `_` placeholder type used in higher-kinded types but it could be thought of as lazy type application as well. See [📄 Higher-Kinded Types (HKT)](hkt.md) for more details.

```ts
import { _, Trait } from "@rinfel/kernel";

export namespace Eq {
    ...

    export const trait = Trait(symbols.trait, {
        equals: Trait.Property(symbols.equals).decl<(other: _) => boolean>(),
    });
```

It is good practice to include types used to implement the behavior required by the trait.

```ts
export namespace Eq {
    ...

    export type Equals<T> = (self: T, other: T) => boolean;
}
```

### Trait Implementations

*Trait implementations take the following form:*

```ts
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

### Auto-Implementations

While there is no built-in mechanism for auto-implementing traits, it is good practice to declare a `<trait>.auto` helper if, for example, the trait has any members with reasonable default implementations.

An auto-implementation could be as simple as this:

```ts
export namespace Eq {
    ...

    export const auto = <T>(equals: Equals<T>): Trait.Accessor<typeof Eq, T> => {
        return {
            equals: SelfFunction.bindSelf(equals),
        } as Trait.Accessor<typeof Eq, T>;
    };
}
```

In some cases however, auto-implementations can be much more useful:

```ts
export namespace Ord {
    ...

    export const auto = <T>(compare: Compare<T>): Trait.Accessor<typeof Ord, T> => {
        return {
            compare: SelfFunction.bindSelf(compare),
            max: SelfFunction.bindSelf(max.auto(compare)),
            min: SelfFunction.bindSelf(min.auto(compare)),
            clamp: SelfFunction.bindSelf(clamp.auto(compare)),
        } as Trait.Accessor<typeof Ord, T>;
    };
}
```

Auto-implementations can then be used in place of regular trait implementations.

```ts
export namespace Point {
    export const equals: Eq.Equals<Point> = (self, other) => {
        return self.x === other.x
            && self.y === other.y;
    };
}

Point.meta.implTrait(Eq, Eq.auto(Point.equals));
```

### Consuming Traits

The `Meta` object bound to each type and the meta helpers bound to each type instance expose a number of helpers for accessing trait properties and introspecting trait implementations.

#### Introspection

`<type>.meta.implements(<trait>)` can be used to introspect whether a trait is implemented for a type.

```ts
Point.meta.implements(Eq)
// => true
Point.meta.implements(Ord)
// => false
```

For type instances, `<type_instance>.is(<trait>)` can be used to introspect whether a trait is implemented for the type of the type instance. This is equivalent to `<type_instance>.meta.implements(<trait>)` but provides better type hints for the type instance than the `Meta` object version.

```ts
const p = Point(5, -2);

if (p.is(Eq))
    // p :: Point & Trait.SymbolAccessor<Eq> & Trait.AccessorObject<Eq>
    p[Eq.symbol].equals(Point(2, 5))

if (p.is(Ord)) // never
    ...
```

#### Trait Cast Accessor

`<type_instance>.as(<trait>)` &mdash; also known as the trait cast accessor &mdash; is the primary way of accessing the trait properties of a type and provides access to them through their trait-scoped names. It acts like a type cast in that the operation is fallible but its signature is non-failing. If safety is not known at compile-time, guard the expression using [#️⃣ a `<type_instance>.is(<trait>)` expression](#introspection).

```ts
const p = Point(5, -2);

// ✅ => false
p.as(Eq).equals(Point(-3, 1));

// ❌ => TypeError: Trait Symbol(Ord) is not implemented on Point.
p.as(Ord)
```

#### Symbol Accessor

Alternatively, bare access to trait properties is available via symbol accessors which take the following form: `<type_instance>[<trait>.properties.<trait_property>.symbol]`. Prefer [#️⃣ trait cast accessors](#trait-cast-accessor) unless used in a hot code path where performance is a concern, see [#️⃣ Performance Considerations](#performance-considerations).

```ts
const p = Point(5, -2);

// These are equivalent calls with different syntax and code paths.
p.as(Eq).equals(Point(-3, 1));
p[Eq.trait.properties.equals.symbol](Point(-3, 1));
```

## Additional Notes

### Requirements

`@rinfel/kernel`'s object model relies on some ES6 features:

**Symbols** are used for implementing globally unique accessors for traits and their properties. Consider using [a `Symbol` polyfill](https://github.com/zloirock/core-js#ecmascript-symbol).

**Proxies** are used to implement the `<type_instance>.as(<trait>).<trait_property>` accessor to correctly bind the receiver of a trait property function to `<type_instance>`. You can avoid using trait cast accessors by using [#️⃣ symbol accessors](#symbol-accessor) instead but note that your dependencies might still make use of them.

### Performance Considerations

[#️⃣ Trait cast accessors (`<type_instance>.as(<trait>).<trait_property>`)](#trait-cast-accessor) make use of proxies to correctly bind the receiver of a trait property function to `<type_instance>>`, and thus incur some performance penalties. You can avoid the performance penalty of trait cast accessors by using [#️⃣ symbol accessors](#symbol-accessor). In general, prefer trait cast accessors unless used in a hot code path where performance is a concern.

The latest benchmark results are as follows:

```log
Result#contains function call x 4,102,048 ops/sec ±6.16% (73 runs sampled)
Result.meta.prototype#contains call x 2,466,362 ops/sec ±5.32% (77 runs sampled)
Result(Symbol(Eq))#equals trait function call x 3,592,037 ops/sec ±4.94% (72 runs sampled)
Result.meta.prototype(Symbol(Eq))#equals trait call x 677,701 ops/sec ±5.35% (71 runs sampled)
```
