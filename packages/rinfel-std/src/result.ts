import { Meta, SelfFunction } from "@rinfel/kernel";
import { Eq, Ord, PartialEq, PartialOrd } from "./comparison";
import { Debug } from "./format";

export type Result<T, E> =
    | Result.Ok<T, E>
    | Result.Err<T, E>
    ;

export namespace Result {
    export interface Methods<T, E> {
        readonly isOk: () => this is Ok<T, E>;
        readonly isErr: () => this is Err<T, E>;
        readonly contains: (value: T) => boolean;
        readonly containsErr: (error: E) => boolean;
        readonly ok: () => T | null;
        readonly err: () => E | null;
        readonly map: <T2>(f: (value: T) => T2) => Result<T2, E>;
        readonly mapOr: <T2>(fallback: T2, f: (value: T) => T2) => T2;
        readonly mapOrElse: <T2>(fallback: (error: E) => T2, f: (value: T) => T2) => T2;
        readonly mapErr: <E2>(f: (error: E) => E2) => Result<T, E2>;
        readonly [Symbol.iterator]: () => Iterator<T>;
        readonly iter: () => Iterator<T>;
        readonly and: <T2>(other: Result<T2, E>) => Result<T2, E>;
        readonly andThen: <T2>(f: (value: T) => Result<T2, E>) => Result<T2, E>;
        readonly or: <E2>(other: Result<T, E2>) => Result<T, E2>;
        readonly orElse: <E2>(f: (error: E) => Result<T, E2>) => Result<T, E2>;
        readonly unwrapOr: (fallback: T) => T;
        readonly unwrapOrElse: (f: (error: E) => T) => T;
        readonly expect: (message: string) => T;
        readonly unwrap: () => T;
        readonly expectErr: (message: string) => E;
        readonly unwrapErr: () => E;
    }

    export namespace Methods {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export type Any = Methods<any, any>;
    }

    export const meta = Meta<Any, Methods.Any>("Result");

    export enum Kind {
        Ok = "Ok",
        Err = "Err",
    }

    export interface Ok<T, E> extends Meta.Object<Result<T, E>, Methods<T, E>> {
        readonly kind: Kind.Ok;
        readonly value: T;
    }

    export function Ok<T, E>(value: T): Ok<T, E> {
        return meta.createObject({
            kind: Kind.Ok,
            value,
        } as const);
    }

    export namespace Ok {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export const Void = Ok<void, any>(undefined);
    }

    export interface Err<T, E> extends Meta.Object<Result<T, E>, Methods<T, E>> {
        readonly kind: Kind.Err;
        readonly error: E;
    }

    export function Err<T, E>(error: E): Err<T, E> {
        return meta.createObject({
            kind: Kind.Err,
            error,
        } as const);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Any = Result<any, any>;
    export type Unknown = Result<unknown, unknown>;
}

export const Ok = Result.Ok;
export const Err = Result.Err;

export namespace Result {
    export function isOk<T, E>(self: Result<T, E>): self is Ok<T, E> {
        return self.kind === Kind.Ok;
    }

    export function isErr<T, E>(self: Result<T, E>): self is Err<T, E> {
        return self.kind === Kind.Err;
    }

    export function contains<T, E>(self: Result<T, E>, value: T): boolean {
        switch (self.kind) {
            case Kind.Ok:
                return self.value === value;
            case Kind.Err:
                return false;
        }
    }

    export function containsErr<T, E>(self: Result<T, E>, error: E): boolean {
        switch (self.kind) {
            case Kind.Ok:
                return false;
            case Kind.Err:
                return self.error === error;
        }
    }

    export function ok<T, E>(self: Result<T, E>): T | null {
        switch (self.kind) {
            case Kind.Ok:
                return self.value;
            case Kind.Err:
                return null;
        }
    }

    export function err<T, E>(self: Result<T, E>): E | null {
        switch (self.kind) {
            case Kind.Ok:
                return null;
            case Kind.Err:
                return self.error;
        }
    }

    export function map<T1, T2, E>(self: Result<T1, E>, f: (value: T1) => T2): Result<T2, E> {
        switch (self.kind) {
            case Kind.Ok:
                return Ok(f(self.value));
            case Kind.Err:
                return Err(self.error);
        }
    }

    export function mapOr<T1, T2, E>(self: Result<T1, E>, fallback: T2, f: (value: T1) => T2): T2 {
        switch (self.kind) {
            case Kind.Ok:
                return f(self.value);
            case Kind.Err:
                return fallback;
        }
    }

    export function mapOrElse<T1, T2, E>(self: Result<T1, E>, fallback: (error: E) => T2, f: (value: T1) => T2): T2 {
        switch (self.kind) {
            case Kind.Ok:
                return f(self.value);
            case Kind.Err:
                return fallback(self.error);
        }
    }

    export function mapErr<T, E1, E2>(self: Result<T, E1>, f: (error: E1) => E2): Result<T, E2> {
        switch (self.kind) {
            case Kind.Ok:
                return Ok(self.value);
            case Kind.Err:
                return Err(f(self.error));
        }
    }

    export function* iter<T, E>(self: Result<T, E>): Iterator<T> {
        if (self.kind === Kind.Ok)
            yield self.value;
    }

    export function and<T1, T2, E>(self: Result<T1, E>, other: Result<T2, E>): Result<T2, E> {
        switch (self.kind) {
            case Kind.Ok:
                return other;
            case Kind.Err:
                return Err(self.error);
        }
    }

    export function andThen<T1, T2, E>(self: Result<T1, E>, f: (value: T1) => Result<T2, E>): Result<T2, E> {
        switch (self.kind) {
            case Kind.Ok:
                return f(self.value);
            case Kind.Err:
                return Err(self.error);
        }
    }

    export function or<T, E1, E2>(self: Result<T, E1>, other: Result<T, E2>): Result<T, E2> {
        switch (self.kind) {
            case Kind.Ok:
                return Ok(self.value);
            case Kind.Err:
                return other;
        }
    }

    export function orElse<T, E1, E2>(self: Result<T, E1>, f: (error: E1) => Result<T, E2>): Result<T, E2> {
        switch (self.kind) {
            case Kind.Ok:
                return Ok(self.value);
            case Kind.Err:
                return f(self.error);
        }
    }

    export function unwrapOr<T, E>(self: Result<T, E>, fallback: T): T {
        switch (self.kind) {
            case Kind.Ok:
                return self.value;
            case Kind.Err:
                return fallback;
        }
    }

    export function unwrapOrElse<T, E>(self: Result<T, E>, f: (error: E) => T): T {
        switch (self.kind) {
            case Kind.Ok:
                return self.value;
            case Kind.Err:
                return f(self.error);
        }
    }

    export function expect<T, E>(self: Result<T, E>, message: string): T {
        switch (self.kind) {
            case Kind.Ok:
                return self.value;
            case Kind.Err:
                throw new Error(`${message}: ${Debug.format(self.error)}`);
        }
    }

    export function unwrap<T, E>(self: Result<T, E>): T {
        switch (self.kind) {
            case Kind.Ok:
                return self.value;
            case Kind.Err:
                throw new Error(`Called \`Result.unwrap()\` on an \`Err\` value: ${Debug.format(self.error)}`);
        }
    }

    export function expectErr<T, E>(self: Result<T, E>, message: string): E {
        switch (self.kind) {
            case Kind.Ok:
                throw new Error(`${message}: ${Debug.format(self.value)}`);
            case Kind.Err:
                return self.error;
        }
    }

    export function unwrapErr<T, E>(self: Result<T, E>): E {
        switch (self.kind) {
            case Kind.Ok:
                throw new Error(`Called \`Result.unwrapErr()\` on an \`Ok\` value: ${Debug.format(self.value)}`);
            case Kind.Err:
                return self.error;
        }
    }
}

Result.meta.impl({
    isOk: SelfFunction.bindSelf(Result.isOk),
    isErr: SelfFunction.bindSelf(Result.isErr),
    contains: SelfFunction.bindSelf(Result.contains),
    containsErr: SelfFunction.bindSelf(Result.containsErr),
    ok: SelfFunction.bindSelf(Result.ok),
    err: SelfFunction.bindSelf(Result.err),
    map: SelfFunction.bindSelf(Result.map),
    mapOr: SelfFunction.bindSelf(Result.mapOr),
    mapOrElse: SelfFunction.bindSelf(Result.mapOrElse),
    mapErr: SelfFunction.bindSelf(Result.mapErr),
    [Symbol.iterator]: SelfFunction.bindSelf(Result.iter),
    iter: SelfFunction.bindSelf(Result.iter),
    and: SelfFunction.bindSelf(Result.and),
    andThen: SelfFunction.bindSelf(Result.andThen),
    or: SelfFunction.bindSelf(Result.or),
    orElse: SelfFunction.bindSelf(Result.orElse),
    unwrapOr: SelfFunction.bindSelf(Result.unwrapOr),
    unwrapOrElse: SelfFunction.bindSelf(Result.unwrapOrElse),
    expect: SelfFunction.bindSelf(Result.expect),
    unwrap: SelfFunction.bindSelf(Result.unwrap),
    expectErr: SelfFunction.bindSelf(Result.expectErr),
    unwrapErr: SelfFunction.bindSelf(Result.unwrapErr),
} as Result.Methods.Any);

export namespace Result {
    export const equals: Eq.Equals<Unknown> = (self, other) => {
        switch (self.kind) {
            case Kind.Ok:
                return other.kind === self.kind && Eq.equals(self.value, other.value);
            case Kind.Err:
                return other.kind === self.kind && Eq.equals(self.error, other.error);
        }
    };
}

Result.meta.implTrait(Eq, Eq.auto(Result.equals));
Result.meta.implTrait(PartialEq, PartialEq.auto(PartialEq.equals.auto(Result.equals)));

export namespace Result {
    export const compare = Ord.compare.struct<Any>({
        kind: Ord.compare.enumerable(Kind),
        value: undefined,
        error: undefined,
    });
}

Result.meta.implTrait(Ord, Ord.auto(Result.compare));
Result.meta.implTrait(PartialOrd, PartialOrd.auto(PartialOrd.partialCompare.auto(Result.compare)));

Result.meta.implTrait(Debug, Debug.auto(
    Debug.format.enumeratedStruct(Result.meta, "kind", {
        [Result.Kind.Ok]: {
            value: undefined,
        },
        [Result.Kind.Err]: {
            error: undefined,
        },
    }),
));
