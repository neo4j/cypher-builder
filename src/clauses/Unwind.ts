/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Expr, Literal, Variable } from "../index.js";
import Cypher from "../index.js";
import type { CypherEnvironment } from "../Environment.js";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists.js";
import { Clause } from "./Clause.js";
import { WithCreate } from "./mixins/clauses/WithCreate.js";
import { WithMatch } from "./mixins/clauses/WithMatch.js";
import { WithMerge } from "./mixins/clauses/WithMerge.js";
import { WithReturn } from "./mixins/clauses/WithReturn.js";
import { WithWith } from "./mixins/clauses/WithWith.js";
import { WithDelete } from "./mixins/sub-clauses/WithDelete.js";
import { WithOrder } from "./mixins/sub-clauses/WithOrder.js";
import { WithSetRemove } from "./mixins/sub-clauses/WithSetRemove.js";
import { Projection } from "./sub-clauses/Projection.js";
import { mixin } from "./utils/mixin.js";

export interface Unwind
    extends WithWith, WithDelete, WithMatch, WithReturn, WithSetRemove, WithCreate, WithMerge, WithOrder {}

/** @group Clauses */
export type UnwindProjectionColumn = [Expr, string | Variable | Literal];

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/unwind/ | Cypher Documentation}
 * @group Clauses
 */
@mixin(WithWith, WithDelete, WithMatch, WithReturn, WithSetRemove, WithCreate, WithMerge, WithOrder)
export class Unwind extends Clause {
    private readonly projection: Projection;

    constructor(projection: UnwindProjectionColumn) {
        super();
        this.projection = new Projection([projection]);
    }

    // Cannot be part of WithUnwind due to dependency cycles
    /** Append an {@link Unwind} clause.
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/unwind/ | Cypher Documentation}
     */
    public unwind(clause: Unwind): Unwind;
    public unwind(projection: UnwindProjectionColumn): Unwind;
    public unwind(clauseOrColumn: Unwind | UnwindProjectionColumn): Unwind {
        if (clauseOrColumn instanceof Unwind) {
            this.addNextClause(clauseOrColumn);
            return clauseOrColumn;
        } else {
            const newUnwind = new Cypher.Unwind(clauseOrColumn);
            this.addNextClause(newUnwind);
            return newUnwind;
        }
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const projectionStr = this.projection.getCypher(env);

        const deleteCypher = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const setCypher = this.compileSetCypher(env);
        const orderCypher = compileCypherIfExists(this.orderByStatement, env, { prefix: "\n" });

        const nextClause = this.compileNextClause(env);

        return `UNWIND ${projectionStr}${setCypher}${deleteCypher}${orderCypher}${nextClause}`;
    }
}
