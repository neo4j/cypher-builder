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

import type { Label } from "../../..";
import type { CypherEnvironment } from "../../../Environment";
import type { PropertyRef } from "../../../references/PropertyRef";
import { compileCypherIfExists } from "../../../utils/compile-cypher-if-exists";
import { RemoveClause } from "../../sub-clauses/Remove";
import type { SetParam } from "../../sub-clauses/Set";
import { SetClause } from "../../sub-clauses/Set";
import { Mixin } from "../Mixin";

export abstract class WithSet extends Mixin {
    private subClauses: Array<SetClause | RemoveClause> | undefined;

    /** Append a `SET` clause. Allowing to assign variable properties to values.
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/set/)
     */
    public set(...params: SetParam[]): this {
        if (!this.subClauses) {
            this.subClauses = []; // Due to mixin wonkiness, we need to lazy initialize
        }

        if (this.lastSubClause instanceof SetClause) {
            this.lastSubClause.addParams(...params);
        } else {
            this.subClauses.push(new SetClause(this, params));
        }

        return this;
    }

    /** Append a `REMOVE` clause.
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/remove/)
     */
    public remove(...properties: Array<PropertyRef | Label>): this {
        if (!this.subClauses) {
            this.subClauses = []; // Due to mixin wonkiness, we need to lazy initialize
        }

        if (this.lastSubClause instanceof RemoveClause) {
            this.lastSubClause.addParams(...properties);
        } else {
            this.subClauses.push(new RemoveClause(this, properties));
        }

        // this.removeClause = new RemoveClause(this, properties);
        return this;
    }

    protected compileSetCypher(env: CypherEnvironment): string {
        const subclausesCypher = (this.subClauses || [])
            .map((subclause) => {
                return compileCypherIfExists(subclause, env, { prefix: "\n" });
            })
            .join("");

        return subclausesCypher;
    }

    private get lastSubClause(): SetClause | RemoveClause | undefined {
        if (!this.subClauses) {
            return undefined;
        }

        return this.subClauses[this.subClauses.length - 1];
    }
}
