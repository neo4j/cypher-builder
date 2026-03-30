/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment.js";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists.js";
import { Clause } from "./Clause.js";
import { WithOrder } from "./mixins/sub-clauses/WithOrder.js";
import { WithDistinctAll } from "./mixins/WithDistinctAll.js";
import type { ProjectionColumn } from "./sub-clauses/Projection.js";
import { Projection } from "./sub-clauses/Projection.js";
import { mixin } from "./utils/mixin.js";

export interface Return extends WithOrder, WithDistinctAll {}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/return/ | Cypher Documentation}
 * @group Clauses
 */
@mixin(WithOrder, WithDistinctAll)
export class Return extends Clause {
    private readonly projection: Projection;

    constructor(...columns: Array<"*" | ProjectionColumn>) {
        super();
        this.projection = new Projection(columns);
    }

    public addColumns(...columns: Array<"*" | ProjectionColumn>): this {
        this.projection.addColumns(columns);
        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const projectionStr = this.projection.getCypher(env);
        const orderStr = compileCypherIfExists(this.orderByStatement, env, { prefix: "\n" });
        const projectionModeStr = this.projectionModeStr();

        return `RETURN${projectionModeStr} ${projectionStr}${orderStr}`;
    }
}
