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
import type { Variable } from "../references/Variable";
import type { Expr } from "../types";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { padBlock } from "../utils/pad-block";
import { Clause } from "./Clause";
import type { Create } from "./Create";
import type { Merge } from "./Merge";
import { WithCreate } from "./mixins/clauses/WithCreate";
import { WithMerge } from "./mixins/clauses/WithMerge";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithWith } from "./mixins/clauses/WithWith";
import { WithDelete } from "./mixins/sub-clauses/WithDelete";
import { WithSetRemove } from "./mixins/sub-clauses/WithSetRemove";
import { mixin } from "./utils/mixin";

export interface Foreach extends WithWith, WithReturn, WithSetRemove, WithDelete, WithCreate, WithMerge {}

export type ForeachClauses = Foreach | Create | Merge;

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/foreach/ | Cypher Documentation}
 * @category Clauses
 */
@mixin(WithWith, WithReturn, WithSetRemove, WithDelete, WithCreate, WithMerge)
export class Foreach extends Clause {
    private readonly variable: Variable;
    private listExpr: Expr | undefined;
    private mapClause: ForeachClauses | undefined;

    constructor(variable: Variable);
    /** @deprecated Use `in` and `do` instead of passing the constructor */
    constructor(variable: Variable, listExpr: Expr, mapClause: ForeachClauses);
    constructor(variable: Variable, listExpr?: Expr, mapClause?: ForeachClauses) {
        super();
        this.variable = variable;
        this.listExpr = listExpr;
        this.mapClause = mapClause;
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
