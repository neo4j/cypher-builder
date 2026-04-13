/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { Clause } from "./Clause";
import { WithOrder } from "./mixins/sub-clauses/WithOrder";
import { WithDistinctAll } from "./mixins/WithDistinctAll";
import type { ProjectionColumn } from "./sub-clauses/Projection";
import { Projection } from "./sub-clauses/Projection";
import { mixin } from "./utils/mixin";

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
