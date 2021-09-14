/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-shadow */

import { SelfFunction, Trait, Meta } from "@rinfel/kernel";
import type { Ord } from "./ord";
import { Ordering } from "./ordering";

export namespace PartialOrd {
    namespace symbols {
        export const trait = Symbol("PartialOrd");

        export const partialCompare = Symbol("PartialOrd.compare");
        export const lt = Symbol("PartialOrd.lt");
        export const le = Symbol("PartialOrd.le");
        export const gt = Symbol("PartialOrd.gt");
        export const ge = Symbol("PartialOrd.ge");
    }

    export const trait = Trait(symbols.trait, {
        partialCompare: Trait.Property(symbols.partialCompare).decl<(other: unknown) => Ordering | undefined>(),
        lt: Trait.Property(symbols.lt).decl<(other: unknown) => boolean>(),
        le: Trait.Property(symbols.le).decl<(other: unknown) => boolean>(),
        gt: Trait.Property(symbols.gt).decl<(other: unknown) => boolean>(),
        ge: Trait.Property(symbols.ge).decl<(other: unknown) => boolean>(),
    });

    export type PartialCompare<T> = (a: T, b: unknown) => Ordering | undefined;

    export function partialCompare<T>(a: T, b: unknown): Ordering | undefined {
        if (Meta.hydrate(a) && a.is(PartialOrd))
            return a[trait.properties.partialCompare.symbol](b);
        if (Meta.hydrate(b) && b.is(PartialOrd))
            return b[trait.properties.partialCompare.symbol](a);

        if (a < (b as never))
            return Ordering.Less;
        if (a > (b as never))
            return Ordering.Greater;

        return Ordering.Equal;
    }

    export namespace partialCompare {
        export const auto = <T>(compare: Ord.Compare<T>): PartialCompare<T> => (a, b) => {
            if (!Meta.hydrate(a)) return undefined;
            if (!Meta.hydrate(b)) return undefined;

            if (b.meta !== a.meta) return undefined;

            return compare(a, b as unknown as T);
        };
    }

    export type Lt<T> = (a: T, other: unknown) => boolean;

    export function lt<T>(a: T, b: unknown): boolean {
        return lt.auto(partialCompare)(a, b);
    }

    export namespace lt {
        export const auto: <T>(prtialCompare: PartialCompare<T>) => Lt<T> = (partialCompare) => (a, b) => {
            return partialCompare(a, b)?.isLt() ?? false;
        };
    }

    export type Le<T> = (a: T, other: unknown) => boolean;

    export function le<T>(a: T, b: unknown): boolean {
        return le.auto(partialCompare)(a, b);
    }

    export namespace le {
        export const auto: <T>(prtialCompare: PartialCompare<T>) => Le<T> = (partialCompare) => (a, b) => {
            return partialCompare(a, b)?.isLe() ?? false;
        };
    }

    export type Gt<T> = (a: T, other: unknown) => boolean;

    export function gt<T>(a: T, b: unknown): boolean {
        return gt.auto(partialCompare)(a, b);
    }

    export namespace gt {
        export const auto: <T>(prtialCompare: PartialCompare<T>) => Gt<T> = (partialCompare) => (a, b) => {
            return partialCompare(a, b)?.isGt() ?? false;
        };
    }

    export type Ge<T> = (a: T, other: unknown) => boolean;

    export function ge<T>(a: T, b: unknown): boolean {
        return ge.auto(partialCompare)(a, b);
    }

    export namespace ge {
        export const auto: <T>(prtialCompare: PartialCompare<T>) => Ge<T> = (partialCompare) => (a, b) => {
            return partialCompare(a, b)?.isGe() ?? false;
        };
    }

    export const auto = <T>(partialCompare: PartialCompare<T>): Trait.Accessor<typeof PartialOrd, T> => {
        return {
            partialCompare: SelfFunction.bindSelf(partialCompare),
            lt: SelfFunction.bindSelf(lt.auto(partialCompare)),
            le: SelfFunction.bindSelf(le.auto(partialCompare)),
            gt: SelfFunction.bindSelf(gt.auto(partialCompare)),
            ge: SelfFunction.bindSelf(ge.auto(partialCompare)),
        } as Trait.Accessor<typeof PartialOrd, T>;
    };
}
