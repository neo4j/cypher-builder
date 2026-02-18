/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
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

    constructor(variable: Variable) {
        super();
        this.variable = variable;
    }

    /** Sets the list expression to be used for the comprehension. If called twice, the expression will be overriden */
    public in(listExpr: Expr): this {
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
