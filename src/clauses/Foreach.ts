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
import { WithRemove } from "./mixins/sub-clauses/WithRemove";
import { WithSet } from "./mixins/sub-clauses/WithSet";
import type { DeleteClause } from "./sub-clauses/Delete";
import type { RemoveClause } from "./sub-clauses/Remove";
import type { SetClause } from "./sub-clauses/Set";
import { mixin } from "./utils/mixin";

export interface Foreach extends WithWith, WithReturn, WithRemove, WithSet, WithDelete, WithCreate, WithMerge {}

type ForeachClauses = Foreach | SetClause | RemoveClause | Create | Merge | DeleteClause;

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/foreach/)
 * @category Clauses
 */
@mixin(WithWith, WithReturn, WithRemove, WithSet, WithDelete, WithCreate, WithMerge)
export class Foreach extends Clause {
    private variable: Variable;
    private listExpr: Expr;
    private mapClause: ForeachClauses;

    constructor(variable: Variable, listExpr: Expr, mapClause: ForeachClauses) {
        super();
        this.variable = variable;
        this.listExpr = listExpr;
        this.mapClause = mapClause;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const variableStr = this.variable.getCypher(env);
        const listExpr = this.listExpr.getCypher(env);
        const mapClauseStr = this.mapClause.getCypher(env);
        const nextClause = this.compileNextClause(env);

        const foreachStr = [`FOREACH (${variableStr} IN ${listExpr} |`, padBlock(mapClauseStr), `)`].join("\n");

        const setCypher = compileCypherIfExists(this.setSubClause, env, { prefix: "\n" });
        const deleteCypher = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const removeCypher = compileCypherIfExists(this.removeClause, env, { prefix: "\n" });

        return `${foreachStr}${setCypher}${removeCypher}${deleteCypher}${nextClause}`;
    }
}
