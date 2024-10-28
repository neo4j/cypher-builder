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
import type { Literal } from "../references/Literal";
import type { Variable } from "../references/Variable";
import type { Expr } from "../types";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { Clause } from "./Clause";
import { WithCall } from "./mixins/clauses/WithCall";
import { WithCallProcedure } from "./mixins/clauses/WithCallProcedure";
import { WithCreate } from "./mixins/clauses/WithCreate";
import { WithMatch } from "./mixins/clauses/WithMatch";
import { WithMerge } from "./mixins/clauses/WithMerge";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithUnwind } from "./mixins/clauses/WithUnwind";
import { WithDelete } from "./mixins/sub-clauses/WithDelete";
import { WithOrder } from "./mixins/sub-clauses/WithOrder";
import { WithWhere } from "./mixins/sub-clauses/WithWhere";
import { Projection } from "./sub-clauses/Projection";
import { mixin } from "./utils/mixin";

// With requires an alias for expressions that are not variables
export type WithProjection = Variable | [Expr, string | Variable | Literal];

export interface With
    extends WithOrder,
        WithReturn,
        WithWhere,
        WithDelete,
        WithMatch,
        WithUnwind,
        WithCreate,
        WithMerge,
        WithCallProcedure,
        WithCall {}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/with/)
 * @category Clauses
 */
@mixin(
    WithOrder,
    WithReturn,
    WithWhere,
    WithDelete,
    WithMatch,
    WithUnwind,
    WithCreate,
    WithMerge,
    WithCallProcedure,
    WithCall
)
export class With extends Clause {
    private readonly projection: Projection;
    private isDistinct = false;
    private withStatement: With | undefined;

    constructor(...columns: Array<"*" | WithProjection>) {
        super();
        this.projection = new Projection(columns);
    }

    public addColumns(...columns: Array<"*" | WithProjection>): this {
        this.projection.addColumns(columns);
        return this;
    }

    public distinct(): this {
        this.isDistinct = true;
        return this;
    }

    // Cannot be part of WithWith due to dependency cycles
    /** Add a {@link With} clause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/with/)
     */
    public with(clause: With): With;
    public with(...columns: Array<"*" | WithProjection>): With;
    public with(clauseOrColumn: With | "*" | WithProjection, ...columns: Array<"*" | WithProjection>): With {
        const withClause = this.getWithClause(clauseOrColumn, columns);
        this.addNextClause(withClause);
        return withClause;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const projectionStr = this.projection.getCypher(env);
        const orderByStr = compileCypherIfExists(this.orderByStatement, env, { prefix: "\n" });
        const withStr = compileCypherIfExists(this.withStatement, env, { prefix: "\n" });
        const whereStr = compileCypherIfExists(this.whereSubClause, env, { prefix: "\n" });
        const deleteStr = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const distinctStr = this.isDistinct ? " DISTINCT" : "";

        const nextClause = this.compileNextClause(env);

        return `WITH${distinctStr} ${projectionStr}${whereStr}${orderByStr}${deleteStr}${withStr}${nextClause}`;
    }

    private getWithClause(clauseOrColumn: With | "*" | WithProjection, columns: Array<"*" | WithProjection>): With {
        if (clauseOrColumn instanceof With) {
            return clauseOrColumn;
        } else {
            return new With(clauseOrColumn, ...columns);
        }
    }
}
