/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { Clause } from "../clauses/Clause";
import type { CypherEnvironment } from "../Environment";
import type { Variable } from "../references/Variable";
import type { Expr } from "../types";
import { WithCall } from "./mixins/clauses/WithCall";
import { WithCallProcedure } from "./mixins/clauses/WithCallProcedure";
import { WithCreate } from "./mixins/clauses/WithCreate";
import { WithFilter } from "./mixins/clauses/WithFilter";
import { WithFinish } from "./mixins/clauses/WithFinish";
import { WithLet } from "./mixins/clauses/WithLet";
import { WithMatch } from "./mixins/clauses/WithMatch";
import { WithMerge } from "./mixins/clauses/WithMerge";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithWith } from "./mixins/clauses/WithWith";
import { mixin } from "./utils/mixin";

/** @inline */
export type LetBinding = [Variable, Expr];

export interface Let
    extends
        WithReturn,
        WithWith,
        WithMatch,
        WithCreate,
        WithMerge,
        WithFinish,
        WithCallProcedure,
        WithCall,
        WithFilter,
        WithLet {}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/25/clauses/let/ | Cypher Documentation}
 * @group Clauses
 * @since Neo4j 2025.06
 */
@mixin(
    WithReturn,
    WithWith,
    WithMatch,
    WithCreate,
    WithMerge,
    WithFinish,
    WithCallProcedure,
    WithCall,
    WithFilter,
    WithLet
)
export class Let extends Clause {
    private readonly bindings: LetBinding[];

    constructor(...bindings: LetBinding[]) {
        super();
        this.bindings = bindings;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const bindingsStr = this.bindings
            .map(([variable, expr]) => `${variable.getCypher(env)} = ${expr.getCypher(env)}`)
            .join(", ");

        const nextClause = this.compileNextClause(env);

        return `LET ${bindingsStr}${nextClause}`;
    }
}
