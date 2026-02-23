/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { WithWhere } from "../../clauses/mixins/sub-clauses/WithWhere.js";
import { mixin } from "../../clauses/utils/mixin.js";
import { CypherASTNode } from "../../CypherASTNode.js";
import type { CypherEnvironment } from "../../Environment.js";
import type { Pattern } from "../../pattern/Pattern.js";
import type { Expr } from "../../types.js";
import { compileCypherIfExists } from "../../utils/compile-cypher-if-exists.js";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PatternComprehension extends WithWhere {}

/** Represents a Pattern comprehension
 * @see {@link https://neo4j.com/docs/cypher-manual/current/values-and-types/lists/#cypher-pattern-comprehension | Cypher Documentation}
 * @group Patterns
 */
@mixin(WithWhere)
export class PatternComprehension extends CypherASTNode {
    private readonly pattern: Pattern;
    private mapExpr: Expr | undefined;

    constructor(pattern: Pattern) {
        super();
        this.pattern = pattern;
    }

    public map(mapExpr: Expr): this {
        this.mapExpr = mapExpr;
        return this;
    }

    /**
     * @internal
     */
    getCypher(env: CypherEnvironment): string {
        const whereStr = compileCypherIfExists(this.whereSubClause, env, { prefix: " " });
        const mapStr = compileCypherIfExists(this.mapExpr, env, { prefix: " | " });
        const patternStr = this.pattern.getCypher(env);

        return `[${patternStr}${whereStr}${mapStr}]`;
    }
}
