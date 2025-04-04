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

import type { Expr, Literal, Variable } from "..";
import Cypher from "..";
import type { CypherEnvironment } from "../Environment";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { Clause } from "./Clause";
import { WithCreate } from "./mixins/clauses/WithCreate";
import { WithMatch } from "./mixins/clauses/WithMatch";
import { WithMerge } from "./mixins/clauses/WithMerge";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithWith } from "./mixins/clauses/WithWith";
import { WithDelete } from "./mixins/sub-clauses/WithDelete";
import { WithOrder } from "./mixins/sub-clauses/WithOrder";
import { WithSetRemove } from "./mixins/sub-clauses/WithSetRemove";
import { Projection } from "./sub-clauses/Projection";
import { mixin } from "./utils/mixin";

export interface Unwind
    extends WithWith,
        WithDelete,
        WithMatch,
        WithReturn,
        WithSetRemove,
        WithCreate,
        WithMerge,
        WithOrder {}

/** @group Clauses */
export type UnwindProjectionColumn = [Expr, string | Variable | Literal];

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/unwind/ | Cypher Documentation}
 * @group Clauses
 */
@mixin(WithWith, WithDelete, WithMatch, WithReturn, WithSetRemove, WithCreate, WithMerge, WithOrder)
export class Unwind extends Clause {
    private readonly projection: Projection;

    constructor(projection: UnwindProjectionColumn) {
        super();
        this.projection = new Projection([projection]);
    }

    // Cannot be part of WithUnwind due to dependency cycles
    /** Append an {@link Unwind} clause.
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/unwind/ | Cypher Documentation}
     */
    public unwind(clause: Unwind): Unwind;
    public unwind(projection: UnwindProjectionColumn): Unwind;
    public unwind(clauseOrColumn: Unwind | UnwindProjectionColumn): Unwind {
        if (clauseOrColumn instanceof Unwind) {
            this.addNextClause(clauseOrColumn);
            return clauseOrColumn;
        } else {
            const newUnwind = new Cypher.Unwind(clauseOrColumn);
            this.addNextClause(newUnwind);
            return newUnwind;
        }
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const projectionStr = this.projection.getCypher(env);

        const deleteCypher = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const setCypher = this.compileSetCypher(env);
        const orderCypher = compileCypherIfExists(this.orderByStatement, env, { prefix: "\n" });

        const nextClause = this.compileNextClause(env);

        return `UNWIND ${projectionStr}${setCypher}${deleteCypher}${orderCypher}${nextClause}`;
    }
}
