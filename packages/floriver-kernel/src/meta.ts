/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-use-before-define */

import { PropertyDescriptor, PropertyDescriptorMap } from "./property_descriptor";
import { Trait, Traitlike } from "./trait";
import { bind } from "./utils/function";
import { mapKeys } from "./utils/object";

/**
 * Types declared with the object model all have a `Meta` object which handles
 * object instantiation, property implementation, type introspection and more,
 * and maintains the underlying JavaScript `prototype`.
 */
export interface Meta<Self, P> {
    /**
     * Name of the type used when constructing this `Meta` object. Displayed as a
     * type name in V8 and some other JavaScript engines.
     */
    readonly name: string;

    /**
     * Implements the type's own properties with the given implementation object.
     */
    readonly impl: (properties: P) => void;
    /**
     * Implements the type's own properties with the given implementation object.
     */
    readonly implWithProperties: (properties: PropertyDescriptorMap<P>) => void;
    /**
     * Implements the given trait's properties on the type with the given
     * implementation object.
     */
    readonly implTrait: <Tr extends Traitlike.Any>(traitlike: Tr, properties: Trait.Accessor<Tr, Self>) => void;
    /**
     * Implements the given trait's properties on the type with the given
     * implementation object.
     */
    readonly implTraitWithProperties: <Tr extends Traitlike.Any>(traitlike: Tr, properties: PropertyDescriptorMap<Trait.Accessor<Tr, Self>>) => void;
    /**
     * Whether the type implements the given trait.
     */
    readonly implements: <Tr extends Traitlike.Any>(traitlike: Tr) => this is Meta<Self, P & Trait.SymbolAccessor<Tr, Self> & Trait.AccessorObject<Tr, Self>>;

    /**
     * Instantiates an object which is bound to this `Meta` object.
     */
    readonly createObject: <O extends Record<string, unknown>>(properties: O) => Prototype.BaseProperties<Self, P> & P & O;
    /**
     * Instantiates an object which is bound to this `Meta` object.
     */
    readonly createObjectWithProperties: <O>(properties?: PropertyDescriptorMap<O>) => Prototype.BaseProperties<Self, P> & P & O;
}

namespace Internal {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export const { Meta: MetaClass } = { Meta: class {} };

    export function hydrateMeta<Self, P>(properties: Meta<Self, P>): Meta<Self, P> {
        const meta = Object.create(MetaClass.prototype);
        Object.assign(meta, properties);

        return meta;
    }
}

export function Meta<Self, P>(name: string, properties?: PropertyDescriptorMap<P>): Meta<Self, P> {
    const { [name]: klass } = { [name]: class {} };

    if (properties != null)
        Object.defineProperties(klass.prototype, properties);

    const meta = Internal.hydrateMeta({
        name,

        impl: (prototypeProperties) => {
            meta.implWithProperties(PropertyDescriptorMap.fromObject(prototypeProperties));
        },

        implWithProperties: (prototypeProperties) => {
            Object.defineProperties(klass.prototype, prototypeProperties);
        },

        implTrait: (traitlike, traitProperties) => {
            const trait = Traitlike.unwrap(traitlike);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const traitPrototype = mapKeys(traitProperties, (key) => trait.properties[key as any].symbol);
            Object.assign(klass.prototype, traitPrototype);

            const trap = (self: unknown): ProxyHandler<never>["get"] => (_target, property) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const symbol = trait.properties[property as any].symbol;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const member = (klass.prototype as any)[symbol] as unknown;
                if (typeof member !== "function") return member;

                return bind(member, self);
            };

            Object.defineProperty(klass.prototype, trait.symbol, {
                get: function(this: unknown) {
                    return new Proxy({}, {
                        get: trap(this),
                    });
                },
                configurable: false,
                enumerable: true,
            });
        },

        implTraitWithProperties: (traitlike, traitProperties) => {
            meta.implTrait(traitlike, PropertyDescriptorMap.createObject(traitProperties));
        },

        implements: (traitlike) => {
            const trait = Traitlike.unwrap(traitlike);

            return Object.getOwnPropertyDescriptor(klass.prototype, trait.symbol) != null;
        },

        createObject: (objectProperties) => {
            const object = Object.create(klass.prototype);
            Object.assign(object, objectProperties);

            return object;
        },

        createObjectWithProperties: (objectProperties) => {
            if (objectProperties == null)
                return Object.create(klass.prototype);
            return Object.create(klass.prototype, objectProperties);
        },
    });

    Object.defineProperties(klass.prototype, {
        meta: PropertyDescriptor.fromValue(meta),
        is: PropertyDescriptor.fromSelfFunction(Prototype.is),
        as: PropertyDescriptor.fromSelfFunction(Prototype.as),
    } as PropertyDescriptorMap<Prototype.BaseProperties<Self, P>>);

    return meta;
}

export namespace Meta {
    /**
     * Base type for all object model value types.
     */
    export type Object<Self, Properties> =
        & Prototype.BaseProperties<Self, Properties>
        & Properties;

    /**
     * Strips all `Meta.Object` properties from an object model value type.
     */
    export type Plain<T> =
        T extends Object<infer Self, infer Properties>
            ? Omit<T, keyof Object<Self, Properties>>
            : T;

    /**
     * Retrieves the `Meta` object of the type of the given object if it is an
     * instance of an object model type.
     */
    export function fetch<Self, P>(value: unknown): Meta<Self, P> | null {
        if (value == null) return null;
        if (typeof value !== "object") return null;

        const object = value as Record<string, unknown>;

        return (object.meta ?? null) as Meta<Self, P> | null;
    }

    /**
     * Type guard which hydrates the type of an unknown object with properties
     * common to instances of object model types if it is one.
     */
    export function hydrate<Self, P>(value: unknown): value is Prototype.BaseProperties<Self, P> {
        return fetch(value) != null;
    }
}

export namespace Prototype {
    export interface BaseProperties<Self, P> {
        /**
         * Accessor for the `Meta` object of the type of the type instance.
         */
        readonly meta: Meta<Self, P>;
        /**
         * Used to introspect whether a trait is implemented for the type of the type
         * instance. This is equivalent to `<type_instance>.meta.implements(<trait>)`
         * but provides better type hints for the type instance than the `Meta` object
         * version.
         */
        readonly is: <Tr extends Traitlike.Any>(traitlike: Tr) => this is Trait.SymbolAccessor<Tr, Self> & Trait.AccessorObject<Tr, Self>;
        /**
         * Also known as the trait cast accessor. It is the primary way of accessing the
         * trait properties of a type and provides access to them through their
         * trait-scoped names. It acts like a type cast in that the operation is fallible
         * but its signature is non-failing. If safety is not known at compile-time,
         * guard the expression using a `<type_instance>.is(<trait>)` expression.
         *
         * Alternatively, bare access to trait properties is available via symbol
         * accessors which take the following form:
         * `<type_instance>[<trait>.properties.<trait_property>.symbol]`. Prefer trait
         * cast accessors unless used in a hot code path where performance is a concern.
         */
        readonly as: <Tr extends Traitlike.Any>(traitlike: Tr) => Trait.Accessor<Tr, Self>;
    }

    /**
     * Used to introspect whether a trait is implemented for the type of the type
     * instance. This is equivalent to `<type_instance>.meta.implements(<trait>)`
     * but provides better type hints for the type instance than the `Meta` object
     * version.
     */
    export function is<Self, P extends BaseProperties<Self, P>, Tr extends Traitlike.Any>(self: P, traitlike: Tr): self is P & Trait.SymbolAccessor<Tr, Self> & Trait.AccessorObject<Tr, Self> {
        return self.meta.implements(traitlike);
    }

    /**
     * Also known as the trait cast accessor. It is the primary way of accessing the
     * trait properties of a type and provides access to them through their
     * trait-scoped names. It acts like a type cast in that the operation is fallible
     * but its signature is non-failing. If safety is not known at compile-time,
     * guard the expression using a `<type_instance>.is(<trait>)` expression.
     *
     * Alternatively, bare access to trait properties is available via symbol
     * accessors which take the following form:
     * `<type_instance>[<trait>.properties.<trait_property>.symbol]`. Prefer trait
     * cast accessors unless used in a hot code path where performance is a concern.
     */
    export function as<Self, P extends BaseProperties<Self, P>, Tr extends Traitlike.Any>(self: P, traitlike: Tr): Trait.Accessor<Tr, Self> {
        const trait = Traitlike.unwrap(traitlike);

        if (self.is(trait))
            return self[trait.symbol];

        throw new TypeError(`Trait ${String(trait.symbol)} is not implemented on ${self.meta.name}.`);
    }
}
