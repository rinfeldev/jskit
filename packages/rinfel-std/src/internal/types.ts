export type Cast<T, U> = T extends U ? T : U;

export namespace Enum {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Keys<T> = Cast<T, keyof any>;
}
