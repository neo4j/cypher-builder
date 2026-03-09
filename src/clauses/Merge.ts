/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Pattern } from "../index.js";
import type { CypherEnvironment } from "../Environment.js";
import type { PathAssign } from "../pattern/PathAssign.js";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists.js";
import { padBlock } from "../utils/pad-block.js";
import { Clause } from "./Clause.js";
import { WithCreate } from "./mixins/clauses/WithCreate.js";
import { WithFinish } from "./mixins/clauses/WithFinish.js";
import { WithReturn } from "./mixins/clauses/WithReturn.js";
import { WithWith } from "./mixins/clauses/WithWith.js";
import { WithDelete } from "./mixins/sub-clauses/WithDelete.js";
import { WithOrder } from "./mixins/sub-clauses/WithOrder.js";
import { WithSetRemove } from "./mixins/sub-clauses/WithSetRemove.js";
import type { OnCreateParam } from "./sub-clauses/OnCreate.js";
import { OnCreate } from "./sub-clauses/OnCreate.js";
import { OnMatch } from "./sub-clauses/OnMatch.js";
import { mixin } from "./utils/mixin.js";

export interface Merge extends WithReturn, WithSetRemove, WithDelete, WithWith, WithCreate, WithFinish, WithOrder {}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/merge/ | Cypher Documentation}
 * @group Clauses
 */
@mixin(WithReturn, WithSetRemove, WithDelete, WithWith, WithCreate, WithFinish, WithOrder)
export class Merge extends Clause {
    private readonly pattern: Pattern | PathAssign<Pattern>;
    private readonly onCreateClause: OnCreate;
    private readonly onMatchClause: OnMatch;

    constructor(pattern: Pattern | PathAssign<Pattern>) {
        super();

        this.pattern = pattern;
        this.onCreateClause = new OnCreate(this);
        this.onMatchClause = new OnMatch(this);
    }

    public onCreateSet(...onCreateParams: OnCreateParam[]): this {
        this.onCreateClause.addParams(...onCreateParams);
        return this;
    }

    public onMatchSet(...onMatchParams: OnCreateParam[]): this {
        this.onMatchClause.addParams(...onMatchParams);
        return this;
    }

    /** Add a {@link Merge} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/merge/ | Cypher Documentation}
     */
    public merge(clauseOrPattern: Merge | Pattern): Merge {
        if (clauseOrPattern instanceof Merge) {
            this.addNextClause(clauseOrPattern);
            return clauseOrPattern;
        }

        const matchClause = new Merge(clauseOrPattern);
        this.addNextClause(matchClause);

        return matchClause;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const mergeStr = `MERGE ${this.pattern.getCypher(env)}`;
        const setCypher = this.compileSetCypher(env);
        const onCreateCypher = compileCypherIfExists(this.onCreateClause, env, { prefix: "\n" });
        const onMatchCypher = compileCypherIfExists(this.onMatchClause, env, { prefix: "\n" });
        const deleteCypher = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const orderCypher = compileCypherIfExists(this.orderByStatement, env, { prefix: "\n" });
        const nextClause = this.compileNextClause(env);

        return `${mergeStr}${padBlock(onCreateCypher)}${padBlock(onMatchCypher)}${setCypher}${deleteCypher}${orderCypher}${nextClause}`;
    }
}
