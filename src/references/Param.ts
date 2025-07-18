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

import type { CypherEnvironment } from "../Environment";
import { Variable } from "./Variable";

/** Represents a parameter that will be passed as a separate object
 * @group Variables
 */
export class Param<T = unknown> extends Variable {
    public value: T;

    constructor(value: T) {
        super();
        this.prefix = "param";
        this.value = value;
    }

    /** Defines if the Param has a value that needs to be returned by the builder */
    public get hasValue(): boolean {
        return this.value !== undefined;
    }

    public getCypher(env: CypherEnvironment): string {
        if (this.isNull) {
            return "NULL";
        }

        return `$${env.getReferenceId(this)}`;
    }

    public get isNull(): boolean {
        return this.value === null;
    }
}

/** Represents a parameter with a given name
 * @group Variables
 */
export class NamedParam extends Param {
    public id: string;

    constructor(name: string, value?: unknown) {
        super(value);
        this.id = name;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        env.addNamedParamReference(this.id, this);
        return super.getCypher(env);
    }
}
