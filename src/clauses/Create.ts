/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment.js";
import { PathAssign } from "../pattern/PathAssign.js";
import { Pattern } from "../pattern/Pattern.js";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists.js";
import { Clause } from "./Clause.js";
import { WithFinish } from "./mixins/clauses/WithFinish.js";
import { WithMerge } from "./mixins/clauses/WithMerge.js";
import { WithReturn } from "./mixins/clauses/WithReturn.js";
import { WithWith } from "./mixins/clauses/WithWith.js";
import { WithDelete } from "./mixins/sub-clauses/WithDelete.js";
import { WithOrder } from "./mixins/sub-clauses/WithOrder.js";
import { WithSetRemove } from "./mixins/sub-clauses/WithSetRemove.js";
import { mixin } from "./utils/mixin.js";

export interface Create extends WithReturn, WithSetRemove, WithWith, WithDelete, WithMerge, WithFinish, WithOrder {}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/create/ | Cypher Documentation}
 * @group Clauses
 */
@mixin(WithReturn, WithSetRemove, WithWith, WithDelete, WithMerge, WithFinish, WithOrder)
export class Create extends Clause {
    private readonly pattern: Pattern | PathAssign<Pattern>;

    constructor(pattern: Pattern | PathAssign<Pattern>) {
        super();
        if (pattern instanceof Pattern || pattern instanceof PathAssign) {
            this.pattern = pattern;
        } else {
            this.pattern = new Pattern(pattern);
        }
    }

    /** Add a {@link Create} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/create/ | Cypher Documentation}
     */
    public create(clauseOrPattern: Create | Pattern): Create {
        if (clauseOrPattern instanceof Create) {
            this.addNextClause(clauseOrPattern);
            return clauseOrPattern;
        }

        const matchClause = new Create(clauseOrPattern);
        this.addNextClause(matchClause);

        return matchClause;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const patternCypher = this.pattern.getCypher(env);

        const setCypher = this.compileSetCypher(env);
        const deleteStr = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const orderByCypher = compileCypherIfExists(this.orderByStatement, env, { prefix: "\n" });

        const nextClause = this.compileNextClause(env);
        return `CREATE ${patternCypher}${setCypher}${deleteStr}${orderByCypher}${nextClause}`;
    }
}
