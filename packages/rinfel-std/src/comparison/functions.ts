/* eslint-disable import/no-cycle */

import type { Ord } from "./ord";
import { Ordering } from "./ordering";

// TODO: max

export function maxBy<T>(a: T, b: T, compare: Ord.Compare<T>): T {
    switch (compare(a, b).kind) {
        case Ordering.Kind.Greater:
            return a;
        default:
            return b;
    }
}

// TODO: maxByKey

// TODO: min

export function minBy<T>(a: T, b: T, compare: Ord.Compare<T>): T {
    switch (compare(a, b).kind) {
        case Ordering.Kind.Greater:
            return b;
        default:
            return a;
    }
}

// TODO: minByKey
