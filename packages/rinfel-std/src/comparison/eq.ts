/* eslint-disable @typescript-eslint/no-shadow */

import { _, Meta, Trait, SelfFunction } from "@rinfel/kernel";

export namespace Eq {
    namespace symbols {
        export const trait = Symbol("Eq");

        export const equals = Symbol("Eq.equals");
    }

    export const trait = Trait(symbols.trait, {
        equals: Trait.Property(symbols.equals).decl<(other: _) => boolean>(),
    });

    export type Equals<T> = (self: T, other: T) => boolean;

    export function equals<T>(a: T, b: T): boolean {
        if (Meta.hydrate(a) && a.is(Eq))
            return a[trait.properties.equals.symbol](b);
        if (Meta.hydrate(b) && b.is(Eq))
            return b[trait.properties.equals.symbol](a);

        return a === b;
    }

    export const auto = <T>(equals: Equals<T>): Trait.Accessor<typeof Eq, T> => {
        return {
            equals: SelfFunction.bindSelf(equals),
        } as Trait.Accessor<typeof Eq, T>;
    };
}
