/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment";
import type { Expr, Literal, Variable } from "../index";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { Clause } from "./Clause";
import { WithCreate } from "./mixins/clauses/WithCreate";
import { WithFilter } from "./mixins/clauses/WithFilter";
import { WithLet } from "./mixins/clauses/WithLet";
import { WithMatch } from "./mixins/clauses/WithMatch";
import { WithMerge } from "./mixins/clauses/WithMerge";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithUnwind } from "./mixins/clauses/WithUnwind";
import { WithWith } from "./mixins/clauses/WithWith";
import { WithDelete } from "./mixins/sub-clauses/WithDelete";
import { WithOrder } from "./mixins/sub-clauses/WithOrder";
import { WithSetRemove } from "./mixins/sub-clauses/WithSetRemove";
import { Projection } from "./sub-clauses/Projection";
import { mixin } from "./utils/mixin";

export interface Unwind
    extends
        WithWith,
        WithDelete,
        WithMatch,
        WithReturn,
        WithSetRemove,
        WithCreate,
        WithMerge,
        WithOrder,
        WithLet,
        WithFilter,
        WithUnwind {}

/** @group Clauses */
export type UnwindProjectionColumn = [Expr, string | Variable | Literal];

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/unwind/ | Cypher Documentation}
 * @group Clauses
 */
@mixin(
    WithWith,
    WithDelete,
    WithMatch,
    WithReturn,
    WithSetRemove,
    WithCreate,
    WithMerge,
    WithOrder,
    WithLet,
    WithFilter,
    WithUnwind
)
export class Unwind extends Clause {
    private readonly projection: Projection;

    constructor(projection: UnwindProjectionColumn) {
        super();
        this.projection = new Projection([projection]);
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
