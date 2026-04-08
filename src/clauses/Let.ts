/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment.js";
import type { Variable } from "../references/Variable.js";
import type { Expr } from "../types.js";
import { Clause } from "./Clause.js";
import { WithCall } from "./mixins/clauses/WithCall.js";
import { WithCallProcedure } from "./mixins/clauses/WithCallProcedure.js";
import { WithCreate } from "./mixins/clauses/WithCreate.js";
import { WithFinish } from "./mixins/clauses/WithFinish.js";
import { WithMatch } from "./mixins/clauses/WithMatch.js";
import { WithMerge } from "./mixins/clauses/WithMerge.js";
import { WithReturn } from "./mixins/clauses/WithReturn.js";
import { WithWith } from "./mixins/clauses/WithWith.js";
import { mixin } from "./utils/mixin.js";

/** @inline */
export type LetBinding = [Variable, Expr];

export interface Let
    extends WithReturn, WithWith, WithMatch, WithCreate, WithMerge, WithFinish, WithCallProcedure, WithCall {}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/25/clauses/let/ | Cypher Documentation}
 * @group Clauses
 * @since Neo4j 2025.06
 */
@mixin(WithReturn, WithWith, WithMatch, WithCreate, WithMerge, WithFinish, WithCallProcedure, WithCall)
export class Let extends Clause {
    private readonly bindings: LetBinding[];

    constructor(...bindings: LetBinding[]) {
        super();
        this.bindings = bindings;
    }

    /** Append a {@link Let} clause.
     * @see {@link https://neo4j.com/docs/cypher-manual/25/clauses/let/ | Cypher Documentation}
     */
    public let(clause: Let): Let;
    public let(...bindings: LetBinding[]): Let;
    public let(clauseOrBinding: Let | LetBinding, ...bindings: LetBinding[]): Let {
        const letClause = this.getLetClause(clauseOrBinding, bindings);
        this.addNextClause(letClause);
        return letClause;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const bindingsStr = this.bindings
            .map(([variable, expr]) => `${variable.getCypher(env)} = ${expr.getCypher(env)}`)
            .join(", ");

        const nextClause = this.compileNextClause(env);

        return `LET ${bindingsStr}${nextClause}`;
    }

    private getLetClause(clauseOrBinding: Let | LetBinding, bindings: LetBinding[]): Let {
        if (clauseOrBinding instanceof Let) {
            return clauseOrBinding;
        } else {
            return new Let(clauseOrBinding, ...bindings);
        }
    }
}
