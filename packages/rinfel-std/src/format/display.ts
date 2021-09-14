import { Trait } from "@rinfel/kernel";

export namespace Display {
    namespace symbols {
        export const trait = Symbol("Display");

        export const format = Symbol("Display.format");
    }

    export const trait = Trait(symbols.trait, {
        format: Trait.Property(symbols.format).decl<() => string>(),
    });

    export type Format<T> = (self: T) => string;
}
