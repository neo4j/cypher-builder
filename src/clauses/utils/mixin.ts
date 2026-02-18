/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

type ConstructorType<T> = new (...args: any[]) => T;
type AbstractConstructorType<T> = abstract new (...args: any[]) => T;

/**
 * Decorator for mixins. Support for adding mixins into classes
 * Based on https://www.typescriptlang.org/docs/handbook/mixins.html
 *
 * All "Mixin" classes will be inherited by the decorated class. Note that mixin classes must be abstract
 * Typings will not automatically be updated, but exporting an interface with the same name will fix typings
 *
 * @example
 * ```ts
 * export interface MyClass extends WithName, WithAge
 * \@mixin(WithName, WithAge)
 * export class MyClass{}
 * ```
 */
export function mixin(...mixins: AbstractConstructorType<any>[]) {
    return (constructor: ConstructorType<any>) => {
        return applyMixins(constructor, mixins);
    };
}

/** Applies mixins into a class
 * Based on https://www.typescriptlang.org/docs/handbook/mixins.html
 */
function applyMixins<T>(baseClass: ConstructorType<T>, mixins: AbstractConstructorType<unknown>[]): ConstructorType<T> {
    for (const baseCtor of mixins) {
        for (const name of Object.getOwnPropertyNames(baseCtor.prototype)) {
            if (name !== "constructor") {
                // Base class constructor takes precedence over mixins
                Object.defineProperty(
                    baseClass.prototype,
                    name,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ?? Object.create(null)
                );
            }
        }
    }

    return baseClass;
}
