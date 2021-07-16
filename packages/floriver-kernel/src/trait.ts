/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-shadow */

import type { $ } from "./hkt";

export interface Trait<
    Symbol extends Trait.Symbol,
    Properties extends Trait.Properties,
> {
    readonly symbol: Symbol;
    readonly properties: Properties;
}

export interface TraitNamespace<
    Symbol extends Trait.Symbol,
    Properties extends Trait.Properties,
> {
    readonly trait: Trait<Symbol, Properties>;
}

export namespace TraitNamespace {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Any = TraitNamespace<any, any>;
}

export type Traitlike<
    Symbol extends Trait.Symbol,
    Properties extends Trait.Properties,
> =
    | Trait<Symbol, Properties>
    | TraitNamespace<Symbol, Properties>
    ;

export namespace Traitlike {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Any = Traitlike<any, any>;

    export type Unwrap<T extends Any> =
        T extends TraitNamespace<infer Symbol, infer Properties>
            ? Trait<Symbol, Properties>
            : T;

    export function unwrap<T extends Any>(traitlike: T): Unwrap<T> {
        if ("trait" in traitlike)
            return traitlike.trait as Unwrap<T>;

        return traitlike as Unwrap<T>;
    }
}

namespace Internal {
    export declare const PropertyType: unique symbol;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    export const { Trait: TraitClass } = { Trait: class {} };

    export function hydrateTrait<
        Symbol extends Trait.Symbol,
        Properties extends Trait.Properties,
    >(properties: Trait<Symbol, Properties>): Trait<Symbol, Properties> {
        const trait = Object.create(TraitClass.prototype);
        Object.assign(trait, properties);

        return trait;
    }
}

export function Trait<
    Symbol extends Trait.Symbol,
    Properties extends Trait.Properties,
>(symbol: Symbol, properties: Properties): Trait<Symbol, Properties> {
    return Internal.hydrateTrait({
        symbol,
        properties,
    });
}

export namespace Trait {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Any = Trait<any, any>;

    export type Symbol = symbol | string;

    export interface Property<TSymbol extends Symbol, T> {
        readonly symbol: TSymbol;
        readonly [Internal.PropertyType]?: T;
    }

    export function Property<TSymbol extends Symbol>(symbol: TSymbol): Property.Declaration<TSymbol> {
        return {
            decl: () => {
                return { symbol };
            },
        };
    }

    export namespace Property {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export type Any = Property<any, any>;

        export interface Declaration<TSymbol extends Symbol> {
            readonly decl: <TProperty>() => Property<TSymbol, TProperty>;
        }
    }

    export type Properties = { [P in Symbol]: Property.Any };

    export namespace Properties {
        export type ToLocalProperties<T extends Properties> =
            { [P in keyof T]: T[P][typeof Internal.PropertyType] };

        export type ToSymbolProperties<T extends Properties> =
            { [P in keyof T as T[P]["symbol"]]: T[P][typeof Internal.PropertyType] };
    }

    export type Accessor<T extends Traitlike.Any, Self> =
        Traitlike.Unwrap<T> extends infer Tr ? Tr extends Any
            ? Properties.ToLocalProperties<Tr["properties"]> extends infer Properties
                ? $<{ [P in keyof Properties]: NonNullable<Properties[P]> }, [Self]>
                : never
            : never : never;

    export type AccessorObject<T extends Traitlike.Any, Self> =
        Traitlike.Unwrap<T> extends infer Tr ? Tr extends Any
            ? { [P in Tr["symbol"]]: Accessor<T, Self> }
            : never : never;

    export type SymbolAccessor<T extends Traitlike.Any, Self> =
        Traitlike.Unwrap<T> extends infer Tr ? Tr extends Any
            ? $<
                { [P in keyof Tr["properties"] as Tr["properties"][P]["symbol"]]:
                    NonNullable<Tr["properties"][P][typeof Internal.PropertyType]> },
                [Self]
            >
            : never : never;
}
