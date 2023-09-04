/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
 *  ```ts
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
    mixins.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            if (name !== "constructor") {
                // Base class constructor takes precedence over mixins
                Object.defineProperty(
                    baseClass.prototype,
                    name,
                    Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ?? Object.create(null)
                );
            }
        });
    });

    return baseClass;
}
