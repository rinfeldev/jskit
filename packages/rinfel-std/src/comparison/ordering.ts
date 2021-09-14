/* eslint-disable import/no-cycle */

import { Meta, SelfFunction } from "@rinfel/kernel";
import { Debug } from "../format";
import { Eq } from "./eq";
import { Ord } from "./ord";
import { PartialEq } from "./partial_eq";
import { PartialOrd } from "./partial_ord";

export type Ordering =
    | Ordering.Less
    | Ordering.Equal
    | Ordering.Greater
    ;

export namespace Ordering {
    export interface Methods {
        readonly isEq: () => this is Equal;
        readonly isNe: () => this is Exclude<Ordering, Equal>;
        readonly isLt: () => this is Less;
        readonly isGt: () => this is Greater;
        readonly isLe: () => this is Less | Equal;
        readonly isGe: () => this is Greater | Equal;
        readonly reverse: () => Ordering;
        readonly then: (other: Ordering) => Ordering;
        readonly thenWith: (f: () => Ordering) => Ordering;
    }

    export const meta = Meta<Ordering, Methods>("Ordering");

    export enum Kind {
        Less = "Less",
        Equal = "Equal",
        Greater = "Greater",
    }

    export interface Less extends Meta.Object<Ordering, Methods> {
        readonly kind: Kind.Less;
    }

    export const Less: Less = meta.createObject({
        kind: Kind.Less,
    } as const);

    export interface Equal extends Meta.Object<Ordering, Methods> {
        readonly kind: Kind.Equal;
    }

    export const Equal: Equal = meta.createObject({
        kind: Kind.Equal,
    } as const);

    export interface Greater extends Meta.Object<Ordering, Methods> {
        readonly kind: Kind.Greater;
    }

    export const Greater: Greater = meta.createObject({
        kind: Kind.Greater,
    } as const);
}

export namespace Ordering {
    export function isEq(self: Ordering): self is Equal {
        return self.kind === Kind.Equal;
    }

    export function isNe(self: Ordering): self is Exclude<Ordering, Equal> {
        return self.kind !== Kind.Equal;
    }

    export function isLt(self: Ordering): self is Less {
        return self.kind === Kind.Less;
    }

    export function isGt(self: Ordering): self is Greater {
        return self.kind === Kind.Greater;
    }

    export function isLe(self: Ordering): self is Less | Equal {
        return self.kind !== Kind.Greater;
    }

    export function isGe(self: Ordering): self is Greater | Equal {
        return self.kind !== Kind.Less;
    }

    export function reverse(self: Ordering): Ordering {
        switch (self.kind) {
            case Kind.Less:
                return Greater;
            case Kind.Equal:
                return Equal;
            case Kind.Greater:
                return Less;
        }
    }

    export function then(self: Ordering, other: Ordering): Ordering {
        switch (self.kind) {
            case Kind.Equal:
                return other;
            default:
                return self;
        }
    }

    export function thenWith(self: Ordering, f: () => Ordering): Ordering {
        switch (self.kind) {
            case Kind.Equal:
                return f();
            default:
                return self;
        }
    }
}

Ordering.meta.impl({
    isEq: SelfFunction.bindSelf(Ordering.isEq),
    isNe: SelfFunction.bindSelf(Ordering.isNe),
    isLt: SelfFunction.bindSelf(Ordering.isLt),
    isGt: SelfFunction.bindSelf(Ordering.isGt),
    isLe: SelfFunction.bindSelf(Ordering.isLe),
    isGe: SelfFunction.bindSelf(Ordering.isGe),
    reverse: SelfFunction.bindSelf(Ordering.reverse),
    then: SelfFunction.bindSelf(Ordering.then),
    thenWith: SelfFunction.bindSelf(Ordering.thenWith),
});

export namespace Ordering {
    export const equals: Eq.Equals<Ordering> = (self, other) => {
        return self.kind === other.kind;
    };
}

Ordering.meta.implTrait(Eq, Eq.auto(Ordering.equals));
Ordering.meta.implTrait(PartialEq, PartialEq.auto(PartialEq.equals.auto(Ordering.equals)));

export namespace Ordering {
    export const compare = Ord.compare.struct<Ordering>({
        kind: Ord.compare.enumerable(Kind),
    });
}

Ordering.meta.implTrait(Ord, Ord.auto(Ordering.compare));
Ordering.meta.implTrait(PartialOrd, PartialOrd.auto(PartialOrd.partialCompare.auto(Ordering.compare)));

Ordering.meta.implTrait(Debug, Debug.auto(
    Debug.format.enumeratedStruct(Ordering.meta, "kind"),
));
