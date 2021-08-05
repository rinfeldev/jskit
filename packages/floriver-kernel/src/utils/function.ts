/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

export function bind<T extends Function>(f: T, thisArg: any): T {
    return ((...args: any[]) => f.apply(thisArg, args)) as unknown as T;
}
