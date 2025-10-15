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
import type { ListIndex } from "../expressions/list/ListIndex";
import { listIndex } from "../expressions/list/ListIndex";
import type { Expr } from "../types";
import { escapeVariable } from "../utils/escape";
import { PropertyRef } from "./PropertyRef";

/** Represents a variable
 * @group Variables
 */
export class Variable {
    /**
     * @internal
     */
    public prefix: string;

    constructor() {
        this.prefix = "var";
    }

    /** Access individual property via the PropertyRef class */
    public property(...path: Array<string | Expr>): PropertyRef {
        return new PropertyRef(this, ...path);
    }

    /* Access individual elements via the ListIndex class, using the square bracket notation */
    public index(index: number): ListIndex {
        return listIndex(this, index);
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const id = env.getReferenceId(this);
        return escapeVariable(id);
    }
}

/** @internal */
export interface NamedReference extends Variable {
    readonly id: string;
}

/**
 * Represents a variable with a explicit name
 * @group Variables
 */
export class NamedVariable extends Variable implements NamedReference {
    public readonly id: string;

    constructor(name: string) {
        super();
        this.id = name;
        this.prefix = "";
    }
}
