/**
 * Self functions are functions with their first, `self` argument marking the
 * current receiver, similar to `this` as in JavaScript methods.
 */
export namespace SelfFunction {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Any = (self: any, ...args: any[]) => any;

    export type BindSelf<T extends Any> =
        T extends (self: infer _Self, ...args: infer Args) => infer Return ? (...args: Args) => Return : never;

    /**
     * Transposes the self function into a JavaScript method, a function with a
     * `this` argument.
     */
    export function bindSelf<T extends Any>(f: T): BindSelf<T> {
        const { [f.name]: boundFunction } = {
            // eslint-disable-next-line func-names, @typescript-eslint/no-explicit-any
            [f.name]: function(this: any, ...args: any[]): any {
                return f(this, ...args);
            } as BindSelf<T>,
        };

        return boundFunction;
    }

    export type BindSelfInRecord<T extends Record<string, Any>> =
        { [P in keyof T]: BindSelf<T[P]> };

    export type Curry<T extends Any> =
        T extends (self: infer Self, ...args: infer Args) => infer Return ? (self: Self) => (...args: Args) => Return : never;

    /**
     * Transposes the self function into a curried function of the form
     * `(self) => (...args) => Return<T>`.
     */
    export function curry<T extends Any>(f: T): Curry<T> {
        const { [f.name]: curriedFunction } = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [f.name]: ((self: any) => (...args: any[]) => {
                return f(self, ...args);
            }) as Curry<T>,
        };

        return curriedFunction;
    }

    export type CurryInRecord<T extends Record<string, Any>> =
        { [P in keyof T]: Curry<T[P]> };
}
