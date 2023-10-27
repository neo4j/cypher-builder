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
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { Clause } from "./Clause";
import { WithCreate } from "./mixins/clauses/WithCreate";
import { WithMatch } from "./mixins/clauses/WithMatch";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithWith } from "./mixins/clauses/WithWith";
import { WithDelete } from "./mixins/sub-clauses/WithDelete";
import { WithRemove } from "./mixins/sub-clauses/WithRemove";
import { WithSet } from "./mixins/sub-clauses/WithSet";
import type { ProjectionColumn } from "./sub-clauses/Projection";
import { Projection } from "./sub-clauses/Projection";
import { mixin } from "./utils/mixin";

export interface Unwind extends WithWith, WithDelete, WithMatch, WithReturn, WithRemove, WithSet, WithCreate {}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/unwind/)
 * @group Clauses
 */
@mixin(WithWith, WithDelete, WithMatch, WithReturn, WithRemove, WithSet, WithCreate)
export class Unwind extends Clause {
    private projection: Projection;

    constructor(...columns: Array<ProjectionColumn>) {
        super();
        this.projection = new Projection(columns);
    }

    public addColumns(...columns: Array<"*" | ProjectionColumn>): void {
        this.projection.addColumns(columns);
    }

    // Cannot be part of WithUnwind due to dependency cycles
    /** Append an {@link Unwind} clause.
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/unwind/)
     */
    public unwind(clause: Unwind): Unwind;
    public unwind(...columns: Array<ProjectionColumn>): Unwind;
    public unwind(clauseOrColumn: Unwind | ProjectionColumn, ...columns: Array<ProjectionColumn>): Unwind {
        if (clauseOrColumn instanceof Unwind) {
            this.addNextClause(clauseOrColumn);
            return clauseOrColumn;
        }

        return this.addColumnsToUnwindClause(clauseOrColumn, ...columns);
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const projectionStr = this.projection.getCypher(env);

        const deleteCypher = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const setCypher = compileCypherIfExists(this.setSubClause, env, { prefix: "\n" });
        const removeCypher = compileCypherIfExists(this.removeClause, env, { prefix: "\n" });

        const nextClause = this.compileNextClause(env);

        return `UNWIND ${projectionStr}${setCypher}${removeCypher}${deleteCypher}${nextClause}`;
    }

    private addColumnsToUnwindClause(...columns: Array<"*" | ProjectionColumn>): Unwind {
        if (!this.nextClause) {
            this.addNextClause(new Unwind());
        }

        if (!(this.nextClause instanceof Unwind)) {
            throw new Error("Invalid Unwind statement");
        }

        this.nextClause.addColumns(...columns);
        return this.nextClause;
    }
}
