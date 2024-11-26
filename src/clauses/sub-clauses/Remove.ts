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

import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { Label } from "../../references/Label";
import type { PropertyRef } from "../../references/PropertyRef";

export class RemoveClause extends CypherASTNode {
    private readonly removeInput: Array<PropertyRef | Label>;

    constructor(parent: CypherASTNode | undefined, removeInput: Array<PropertyRef | Label>) {
        super(parent);
        this.removeInput = removeInput;
    }

    public addParams(...params: Array<PropertyRef | Label>): void {
        this.removeInput.push(...params);
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const propertiesToDelete = this.removeInput.map((e) => e.getCypher(env));
        return `REMOVE ${propertiesToDelete.join(", ")}`;
    }
}
