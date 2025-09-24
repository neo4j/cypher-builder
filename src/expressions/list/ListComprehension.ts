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
import { WithWhere } from "../../clauses/mixins/sub-clauses/WithWhere";
import { mixin } from "../../clauses/utils/mixin";
import type { Variable } from "../../references/Variable";
import type { Expr } from "../../types";
import { compileCypherIfExists } from "../../utils/compile-cypher-if-exists";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ListComprehension extends WithWhere {}

/** Represents a List comprehension
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/lists/#cypher-list-comprehension | Cypher Documentation}
 * @group Lists
 */
@mixin(WithWhere)
export class ListComprehension extends CypherASTNode {
    private readonly variable: Variable;
    private listExpr: Expr | undefined;
    private mapExpr: Expr | undefined; //  Expression for list mapping

    constructor(variable: Variable);
    /** @deprecated Use `new ListComprehension(var1).in(expr)` instead */
    constructor(variable: Variable, listExpr: Expr);
    constructor(variable: Variable, listExpr?: Expr) {
        super();
        this.variable = variable;
        this.listExpr = listExpr;
    }

    public in(listExpr: Expr): this {
        if (this.listExpr) throw new Error("Cannot set 2 lists in list comprehension IN");
        this.listExpr = listExpr;
        return this;
    }

    public map(mapExpr: Expr): this {
        this.mapExpr = mapExpr;
        return this;
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        if (!this.listExpr) throw new Error("List Comprehension needs a source list after IN using .in()");
        const whereStr = compileCypherIfExists(this.whereSubClause, env, { prefix: " " });
        const mapStr = compileCypherIfExists(this.mapExpr, env, { prefix: " | " });
        const listExprStr = this.listExpr.getCypher(env);
        const varCypher = this.variable.getCypher(env);

        return `[${varCypher} IN ${listExprStr}${whereStr}${mapStr}]`;
    }
}
