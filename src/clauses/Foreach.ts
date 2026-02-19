/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment.js";
import type { Variable } from "../references/Variable.js";
import type { Expr } from "../types.js";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists.js";
import { padBlock } from "../utils/pad-block.js";
import { Clause } from "./Clause.js";
import type { Create } from "./Create.js";
import type { Merge } from "./Merge.js";
import { WithCreate } from "./mixins/clauses/WithCreate.js";
import { WithMerge } from "./mixins/clauses/WithMerge.js";
import { WithReturn } from "./mixins/clauses/WithReturn.js";
import { WithWith } from "./mixins/clauses/WithWith.js";
import { WithDelete } from "./mixins/sub-clauses/WithDelete.js";
import { WithSetRemove } from "./mixins/sub-clauses/WithSetRemove.js";
import { mixin } from "./utils/mixin.js";

export interface Foreach extends WithWith, WithReturn, WithSetRemove, WithDelete, WithCreate, WithMerge {}

/**
 * Valid Clauses to be used inside {@link Foreach}
 * @group Clauses */
export type ForeachClauses = Foreach | Create | Merge;

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/foreach/ | Cypher Documentation}
 * @group Clauses
 */
@mixin(WithWith, WithReturn, WithSetRemove, WithDelete, WithCreate, WithMerge)
export class Foreach extends Clause {
    private readonly variable: Variable;
    private listExpr: Expr | undefined;
    private mapClause: ForeachClauses | undefined;

    constructor(variable: Variable);
    constructor(variable: Variable) {
        super();
        this.variable = variable;
    }

    public in(listExpr: Expr): this {
        this.listExpr = listExpr;
        return this;
    }

    public do(mapClause: ForeachClauses): this {
        this.mapClause = mapClause;
        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        if (!this.listExpr) throw new Error("FOREACH needs a source list after IN using .in()");
        if (!this.mapClause) throw new Error("FOREACH needs an updating command using .do()");

        const variableStr = this.variable.getCypher(env);
        const listExpr = this.listExpr.getCypher(env);
        const mapClauseStr = this.mapClause.getCypher(env);
        const nextClause = this.compileNextClause(env);

        const foreachStr = [`FOREACH (${variableStr} IN ${listExpr} |`, padBlock(mapClauseStr), `)`].join("\n");

        const setCypher = this.compileSetCypher(env);
        const deleteCypher = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });

        return `${foreachStr}${setCypher}${deleteCypher}${nextClause}`;
    }
}
