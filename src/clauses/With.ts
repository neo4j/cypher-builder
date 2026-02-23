/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment.js";
import type { Literal } from "../references/Literal.js";
import type { Variable } from "../references/Variable.js";
import type { Expr } from "../types.js";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists.js";
import { Clause } from "./Clause.js";
import { WithCall } from "./mixins/clauses/WithCall.js";
import { WithCallProcedure } from "./mixins/clauses/WithCallProcedure.js";
import { WithCreate } from "./mixins/clauses/WithCreate.js";
import { WithMatch } from "./mixins/clauses/WithMatch.js";
import { WithMerge } from "./mixins/clauses/WithMerge.js";
import { WithReturn } from "./mixins/clauses/WithReturn.js";
import { WithUnwind } from "./mixins/clauses/WithUnwind.js";
import { WithDelete } from "./mixins/sub-clauses/WithDelete.js";
import { WithOrder } from "./mixins/sub-clauses/WithOrder.js";
import { WithSetRemove } from "./mixins/sub-clauses/WithSetRemove.js";
import { WithWhere } from "./mixins/sub-clauses/WithWhere.js";
import { Projection } from "./sub-clauses/Projection.js";
import { mixin } from "./utils/mixin.js";

// With requires an alias for expressions that are not variables
/** @inline */
export type WithProjection = Variable | [Expr, string | Variable | Literal];

export interface With
    extends
        WithOrder,
        WithReturn,
        WithWhere,
        WithSetRemove,
        WithDelete,
        WithMatch,
        WithUnwind,
        WithCreate,
        WithMerge,
        WithCallProcedure,
        WithCall {}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/with/ | Cypher Documentation}
 * @group Clauses
 */
@mixin(
    WithOrder,
    WithReturn,
    WithWhere,
    WithSetRemove,
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
    private readonly withStatement: With | undefined;
    private isDistinct = false;

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
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/with/ | Cypher Documentation}
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
        const setCypher = this.compileSetCypher(env);
        const deleteStr = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const distinctStr = this.isDistinct ? " DISTINCT" : "";

        const nextClause = this.compileNextClause(env);

        return `WITH${distinctStr} ${projectionStr}${whereStr}${setCypher}${orderByStr}${deleteStr}${withStr}${nextClause}`;
    }

    private getWithClause(clauseOrColumn: With | "*" | WithProjection, columns: Array<"*" | WithProjection>): With {
        if (clauseOrColumn instanceof With) {
            return clauseOrColumn;
        } else {
            return new With(clauseOrColumn, ...columns);
        }
    }
}
