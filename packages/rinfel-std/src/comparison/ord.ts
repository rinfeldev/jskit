/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-shadow */

import { _, SelfFunction, Trait, Meta } from "@rinfel/kernel";
import { maxBy, minBy } from "./functions";
import { Ordering } from "./ordering";

export namespace Ord {
    namespace symbols {
        export const trait = Symbol("Ord");

        export const compare = Symbol("Ord.compare");
        export const max = Symbol("Ord.max");
        export const min = Symbol("Ord.min");
        export const clamp = Symbol("Ord.clamp");
    }

    export const trait = Trait(symbols.trait, {
        compare: Trait.Property(symbols.compare).decl<(other: _) => Ordering>(),
        max: Trait.Property(symbols.max).decl<(other: _) => _>(),
        min: Trait.Property(symbols.min).decl<(other: _) => _>(),
        clamp: Trait.Property(symbols.min).decl<(min: _, max: _) => _>(),
    });

    export type Compare<T> = (a: T, b: T) => Ordering;

    export function compare<T>(a: T, b: T): Ordering {
        if (Meta.hydrate(a) && a.is(Ord))
            return a[trait.properties.compare.symbol](b);
        if (Meta.hydrate(b) && b.is(Ord))
            return b[trait.properties.compare.symbol](a);

        if (a < b)
            return Ordering.Less;
        if (a > b)
            return Ordering.Greater;

        return Ordering.Equal;
    }

    export namespace compare {
        export const values = <T>(lexicalOrder: T[]): Compare<T> => (a, b) => {
            return compare(lexicalOrder.indexOf(a), lexicalOrder.indexOf(b));
        };

        export const enumerable = <T>(enumerable: T): Compare<keyof T> => {
            return values(Object.values(enumerable));
        };

        export const struct = <T>(lexicalOrder: { [P in keyof T]?: Compare<T[P]> }): Compare<T> => (a, b) => {
            const entries = Object.entries(lexicalOrder) as [keyof T, Compare<unknown> | undefined][];

            for (const [key, compareOverride] of entries) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (a[key] == null || b[key] == null)
                    continue;

                const ordering = (compareOverride ?? compare)(a[key], b[key]);
                if (ordering.isEq())
                    continue;

                return ordering;
            }

            return Ordering.Equal;
        };
    }

    export type Max<T> = (a: T, b: T) => T;

    export function max<T>(a: T, b: T): T {
        return max.auto(compare)(a, b);
    }

    export namespace max {
        export const auto: <T>(compare: Compare<T>) => Max<T> = (compare) => (a, b) => {
            return maxBy(a, b, compare);
        };
    }

    export type Min<T> = (a: T, b: T) => T;

    export function min<T>(a: T, b: T): T {
        return min.auto(compare)(a, b);
    }

    export namespace min {
        export const auto: <T>(compare: Compare<T>) => Min<T> = (compare) => (a, b) => {
            return minBy(a, b, compare);
        };
    }

    export type Clamp<T> = (v: T, a: T, b: T) => T;

    export function clamp<T>(v: T, a: T, b: T): T {
        return clamp.auto(compare)(v, a, b);
    }

    export namespace clamp {
        export const auto: <T>(compare: Compare<T>) => Clamp<T> = (compare) => (v, min, max) => {
            // TODO: assert(min <= max);

            if (compare(v, min).isLt())
                return min;
            if (compare(v, max).isGt())
                return max;

            return v;
        };
    }

    export const auto = <T>(compare: Compare<T>): Trait.Accessor<typeof Ord, T> => {
        return {
            compare: SelfFunction.bindSelf(compare),
            max: SelfFunction.bindSelf(max.auto(compare)),
            min: SelfFunction.bindSelf(min.auto(compare)),
            clamp: SelfFunction.bindSelf(clamp.auto(compare)),
        } as Trait.Accessor<typeof Ord, T>;
    };
}
