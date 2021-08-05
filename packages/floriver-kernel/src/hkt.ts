/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */

declare const PlaceholderIndex: unique symbol;

export interface _<N extends number = 0> {
    readonly [PlaceholderIndex]: N;
}

export type _0 = _<0>;
export type _1 = _<1>;
export type _2 = _<2>;
export type _3 = _<3>;
export type _4 = _<4>;
export type _5 = _<5>;
export type _6 = _<6>;
export type _7 = _<7>;
export type _8 = _<8>;
export type _9 = _<9>;

declare const FixedType: unique symbol;

export interface Fixed<T> {
    readonly [FixedType]: T;
}

/* eslint-disable @typescript-eslint/indent */
export type $<T, S extends any[]> =
    // Skip recursing into `Fixed<_>` types and substitute with the inner type.
    T extends Fixed<infer U> ? U :
    // Substitute the appropriate type value for a placeholder.
    T extends _<infer N> ? S[N] :
    // Ignore built-in primitives.
    T extends undefined | null | boolean | number | string ? T :
    // Substitute functions by recursing into their input and output types.
    T extends (...args: infer I) => infer O ? (...args: $<I, S>) => $<O, S> :
    // Substitute tuples by recursing into their content types.
    T extends any[] ? { [K in keyof T]: $<T[K], S> } :
    // Substitute objects by recursing into their value types.
    T extends object ? EqualsOr<T, { [K in keyof T]: $<T[K], S> }> :
    // Leave any other case as-is. Base case of recursion.
    T;
/* eslint-enable @typescript-eslint/indent */

type EqualsOr<T, U> =
    T extends U
        ? U extends T
            ? T
            : U
        : U;
