export function mapEntries<K1 extends PropertyKey, V1, K2 extends PropertyKey, V2>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    o: { [P in K1]: V1 } | {} | ArrayLike<V1>,
    f: (key: K1, value: V1) => [key: K2, value: V2],
): { [P in K2]: V2 } {
    const entries = Object.entries(o)
        .map(([key, value]) => f(key as K1, value));

    return Object.fromEntries(entries) as { [P in K2]: V2 };
}

export function mapKeys<K1 extends PropertyKey, K2 extends PropertyKey, V>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    o: { [P in K1]: V } | {} | ArrayLike<V>,
    f: (key: K1, value: V) => K2,
): { [P in K2]: V } {
    return mapEntries(o, (key, value) => [f(key, value), value]);
}

export function mapValues<K extends PropertyKey, V1, V2>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    o: { [P in K]: V1 } | {} | ArrayLike<V1>,
    f: (key: K, value: V1) => V2,
): { [P in K]: V2 } {
    return mapEntries(o, (key, value) => [key, f(key, value)]);
}
