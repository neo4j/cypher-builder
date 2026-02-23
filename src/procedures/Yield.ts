/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment.js";
import { Clause } from "../clauses/Clause.js";
import { WithCreate } from "../clauses/mixins/clauses/WithCreate.js";
import { WithMatch } from "../clauses/mixins/clauses/WithMatch.js";
import { WithMerge } from "../clauses/mixins/clauses/WithMerge.js";
import { WithReturn } from "../clauses/mixins/clauses/WithReturn.js";
import { WithUnwind } from "../clauses/mixins/clauses/WithUnwind.js";
import { WithWith } from "../clauses/mixins/clauses/WithWith.js";
import { WithDelete } from "../clauses/mixins/sub-clauses/WithDelete.js";
import { WithOrder } from "../clauses/mixins/sub-clauses/WithOrder.js";
import { WithSetRemove } from "../clauses/mixins/sub-clauses/WithSetRemove.js";
import { WithWhere } from "../clauses/mixins/sub-clauses/WithWhere.js";
import type { ProjectionColumn } from "../clauses/sub-clauses/Projection.js";
import { Projection } from "../clauses/sub-clauses/Projection.js";
import { mixin } from "../clauses/utils/mixin.js";
import type { Literal } from "../references/Literal.js";
import type { Variable } from "../references/Variable.js";
import { NamedVariable } from "../references/Variable.js";
import type { Expr } from "../types.js";
import { asArray } from "../utils/as-array.js";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists.js";

/** @group Clauses */
export type YieldProjectionColumn<T extends string> = T | [T, Variable | Literal | string];

export interface Yield
    extends
        WithReturn,
        WithWhere,
        WithWith,
        WithMatch,
        WithUnwind,
        WithDelete,
        WithMerge,
        WithCreate,
        WithSetRemove,
        WithOrder {}

/** Yield statement after a Procedure CALL
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/call/#call-call-a-procedure-call-yield-star | Cypher Documentation}
 * @group Procedures
 */
@mixin(
    WithReturn,
    WithWhere,
    WithWith,
    WithMatch,
    WithUnwind,
    WithDelete,
    WithMerge,
    WithCreate,
    WithSetRemove,
    WithOrder
)
export class Yield<T extends string = string> extends Clause {
    private readonly projection: YieldProjection;

    constructor(yieldColumns: Array<YieldProjectionColumn<T>>) {
        super();

        const columns = asArray(yieldColumns);
        this.projection = new YieldProjection(columns);
    }

    public yield(...columns: Array<YieldProjectionColumn<T>>): this {
        this.projection.addYieldColumns(columns);
        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const yieldProjectionStr = this.projection.getCypher(env);

        const deleteCypher = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const setCypher = this.compileSetCypher(env);
        const orderByCypher = compileCypherIfExists(this.orderByStatement, env, { prefix: "\n" });

        const whereStr = compileCypherIfExists(this.whereSubClause, env, {
            prefix: "\n",
        });

        const nextClause = this.compileNextClause(env);
        return `YIELD ${yieldProjectionStr}${whereStr}${setCypher}${deleteCypher}${orderByCypher}${nextClause}`;
    }
}

class YieldProjection extends Projection {
    constructor(columns: Array<YieldProjectionColumn<string>>) {
        super([]);
        this.addYieldColumns(columns);
    }

    public addYieldColumns(columns: Array<YieldProjectionColumn<string>>) {
        const parsedColumns = columns.map((c) => this.parseYieldColumn(c));
        this.addColumns(parsedColumns);
    }

    private parseYieldColumn(input: YieldProjectionColumn<string>): "*" | ProjectionColumn {
        if (input === "*") return input;
        if (typeof input === "string") return this.createVariableForStrings(input);
        if (Array.isArray(input)) {
            return [this.createVariableForStrings(input[0]), input[1]];
        }
        return input;
    }

    private createVariableForStrings(rawVar: Expr | string | Variable | Literal): Expr {
        if (typeof rawVar === "string") return new NamedVariable(rawVar);
        return rawVar;
    }
}
