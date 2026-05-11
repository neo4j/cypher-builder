/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment";
import { Clause } from "./Clause";
import { WithCall } from "./mixins/clauses/WithCall";
import { WithCallProcedure } from "./mixins/clauses/WithCallProcedure";
import { WithCreate } from "./mixins/clauses/WithCreate";
import { WithFilter } from "./mixins/clauses/WithFilter";
import { WithFinish } from "./mixins/clauses/WithFinish";
import { WithLet } from "./mixins/clauses/WithLet";
import { WithMatch } from "./mixins/clauses/WithMatch";
import { WithMerge } from "./mixins/clauses/WithMerge";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithUnwind } from "./mixins/clauses/WithUnwind";
import { WithWith } from "./mixins/clauses/WithWith";
import { mixin } from "./utils/mixin";

export interface Next
    extends
        WithMatch,
        WithReturn,
        WithCreate,
        WithMerge,
        WithWith,
        WithFilter,
        WithUnwind,
        WithFinish,
        WithLet,
        WithCall,
        WithCallProcedure {}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/25/queries/composed-queries/sequential-queries/ | Cypher Documentation}
 * @group Clauses
 * @since Neo4j 2025.06
 */
@mixin(
    WithMatch,
    WithReturn,
    WithCreate,
    WithMerge,
    WithWith,
    WithFilter,
    WithUnwind,
    WithFinish,
    WithLet,
    WithCall,
    WithCallProcedure
)
export class Next extends Clause {
    constructor(clause?: Clause) {
        super();
        if (clause !== undefined) {
            this.addNextClause(clause);
        }
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const nextClause = this.compileNextClause(env);
        return `NEXT${nextClause}`;
    }
}
