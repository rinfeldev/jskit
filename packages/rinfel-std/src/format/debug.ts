/* eslint-disable @typescript-eslint/no-shadow */

import { Meta, SelfFunction, Trait } from "@rinfel/kernel";
import { Enum } from "../internal/types";

export namespace Debug {
    namespace symbols {
        export const trait = Symbol("Debug");

        export const format = Symbol("Debug.format");
    }

    export const trait = Trait(symbols.trait, {
        format: Trait.Property(symbols.format).decl<() => string>(),
    });

    export type Format<T> = (self: T) => string;

    export function format<T>(self: T): string {
        if (Meta.hydrate(self)) {
            if (self.is(Debug))
                return self[trait.properties.format.symbol]();

            return format.struct(self.meta, {})(self);
        }

        if (self === null)
            return "Null";

        switch (typeof self) {
            case "bigint":
                return `BigInt(${self})`;
            case "boolean":
                return `Boolean(${self})`;
            case "function":
                return `Function(${self.name})`;
            case "number":
                return `Number(${self})`;
            case "object":
                return `Object(${JSON.stringify(self)})`;
            case "string":
                return `String(${JSON.stringify(self)})`;
            case "symbol":
                return `Symbol(${self.description ?? ""})`;
            case "undefined":
                return `Undefined`;
        }

        return "<Missing Debug.format>";
    }

    export namespace format {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export const plain: Format<any> = String;

        export const enumerable = plain;

        const structBody = <T>(struct: { [P in keyof T]?: Format<T[P]> }): Format<T> => (self) => {
            const entries = Object.entries(struct) as [keyof T, Format<unknown> | undefined][];

            return entries
                .map(([key, formatOverride]) => [key, (formatOverride ?? format)(self[key])] as const)
                .map(([key, value]) => `${key as string}: ${value}`)
                .join(", ");
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export const struct = <T>(meta: Meta<T, any>, struct: { [P in keyof T]?: Format<T[P]> }): Format<T> => (self) => {
            const body = structBody(struct)(self);

            return `${meta.name} {${body.length <= 0 ? "" : ` ${body} `}}`;
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export const enumeratedStruct = <T, K extends keyof T, E extends T[K]>(meta: Meta<T, any>, kind: K, variants?: { [V in Enum.Keys<E>]?: { [P in keyof T]?: Format<T[P]> } }): Format<T> => (self) => {
            const name = `${meta.name}.${String(self[kind])}`;

            const structVariant = variants?.[self[kind] as Enum.Keys<E>];
            if (structVariant == null)
                return name;

            const body = structBody(structVariant)(self);

            return `${name} {${body.length <= 0 ? "" : ` ${body} `}}`;
        };
    }

    export const auto = <T>(format: Format<T>): Trait.Accessor<typeof Debug, T> => {
        return {
            format: SelfFunction.bindSelf(format),
        } as Trait.Accessor<typeof Debug, T>;
    };
}
