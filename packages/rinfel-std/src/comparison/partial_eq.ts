/* eslint-disable @typescript-eslint/no-shadow */

import { Meta, SelfFunction, Trait } from "@rinfel/kernel";
import type { Eq } from "./eq";

export namespace PartialEq {
    namespace symbols {
        export const trait = Symbol("PartialEq");

        export const equals = Symbol("PartialEq.equals");
    }

    export const trait = Trait(symbols.trait, {
        equals: Trait.Property(symbols.equals).decl<(other: unknown) => boolean>(),
    });

    export type Equals<T> = (self: T, other: unknown) => boolean;

    export function equals<T>(a: T, b: unknown): boolean {
        if (Meta.hydrate(a) && a.is(PartialEq))
            return a[trait.properties.equals.symbol](b);
        if (Meta.hydrate(b) && b.is(PartialEq))
            return b[trait.properties.equals.symbol](a);

        return a === b;
    }

    export namespace equals {
        export const auto = <T>(equals: Eq.Equals<T>): Equals<T> => (a, b) => {
            if (!Meta.hydrate(a)) return false;
            if (!Meta.hydrate(b)) return false;

            if (b.meta !== a.meta) return false;

            return equals(a, b as unknown as T);
        };
    }

    export const auto = <T>(equals: Equals<T>): Trait.Accessor<typeof PartialEq, T> => {
        return {
            equals: SelfFunction.bindSelf(equals),
        } as Trait.Accessor<typeof PartialEq, T>;
    };
}
