import { SelfFunction } from "./self_function";
import { mapValues } from "./utils/object";

export namespace PropertyDescriptor {
    export function fromValue<T>(value: T): TypedPropertyDescriptor<T> {
        return {
            value,
            configurable: false,
            enumerable: true,
            writable: false,
        };
    }

    export function fromSelfFunction<T extends SelfFunction.Any>(f: T): TypedPropertyDescriptor<SelfFunction.BindSelf<T>> {
        return fromValue(SelfFunction.bindSelf(f));
    }
}

export type PropertyDescriptorMap<T> =
    { [P in keyof T]: TypedPropertyDescriptor<T[P]> };

export namespace PropertyDescriptorMap {
    export function fromObject<T>(object: T): PropertyDescriptorMap<T> {
        return mapValues(object, (_key, value) => PropertyDescriptor.fromValue(value)) as PropertyDescriptorMap<T>;
    }

    export function fromSelfFunctions<T extends Record<string, SelfFunction.Any>>(functions: T): PropertyDescriptorMap<SelfFunction.BindSelfInRecord<T>> {
        return mapValues(functions, (_key, value) => PropertyDescriptor.fromSelfFunction(value)) as unknown as PropertyDescriptorMap<SelfFunction.BindSelfInRecord<T>>;
    }

    export function createObject<T>(propertyDescriptorMap: PropertyDescriptorMap<T>): T {
        const object = {};
        Object.defineProperties(object, propertyDescriptorMap);

        return object as T;
    }
}
