/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment";
import { and } from "../expressions/operations/boolean";
import type { Predicate } from "../types";
import { Clause } from "./Clause";
import { WithCreate } from "./mixins/clauses/WithCreate";
import { WithMatch } from "./mixins/clauses/WithMatch";
import { WithMerge } from "./mixins/clauses/WithMerge";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithWith } from "./mixins/clauses/WithWith";
import { mixin } from "./utils/mixin";

export interface Filter extends WithReturn, WithWith, WithMatch, WithMerge, WithCreate {}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/filter/ | Cypher Documentation}
 * @group Clauses
 */
@mixin(WithReturn, WithWith, WithMatch, WithMerge, WithCreate)
export class Filter extends Clause {
    private predicate: Predicate;

    constructor(filterInput: Predicate) {
        super();
        this.predicate = filterInput;
        this.addChildren(this.predicate);
    }

    public and(op: Predicate): this {
        this.predicate = and(this.predicate, op);
        this.addChildren(this.predicate);
        return this;
    }

    /** Add a {@link Filter} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/filter/ | Cypher Documentation}
     */
    public filter(predicate: Predicate): Filter {
        const matchClause = new Filter(predicate);
        this.addNextClause(matchClause);

        return matchClause;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const opStr = this.predicate.getCypher(env);
        let filterStr = "";
        if (opStr) filterStr = `FILTER ${opStr}`;

        const nextClause = this.compileNextClause(env);
        return `${filterStr}${nextClause}`;
    }
}
