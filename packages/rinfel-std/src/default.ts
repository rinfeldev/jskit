/* eslint-disable @typescript-eslint/no-shadow */

import { _, Meta, SelfFunction, Trait } from "@rinfel/kernel";

export namespace Default {
    namespace symbols {
        export const trait = Symbol("Default");

        export const value = Symbol("Default.value");
    }

    export const trait = Trait(symbols.trait, {
        value: Trait.Property(symbols.value).decl<() => _>(),
    });

    export type Value<T> = () => T;

    export function value<T>(meta: Meta<T, unknown>): T {
        if (!meta.implements(Default))
            throw new Error("TODO"); // TODO

        return meta.prototype[trait.properties.value.symbol]();
    }

    export const auto = <T>(value: Value<T>): Trait.Accessor<typeof Default, T> => {
        return {
            value: SelfFunction.bindSelf(value),
        } as Trait.Accessor<typeof Default, T>;
    };
}
