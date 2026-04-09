/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { Clause } from "./Clause";
import { WithOrder } from "./mixins/sub-clauses/WithOrder";
import type { ProjectionColumn } from "./sub-clauses/Projection";
import { Projection } from "./sub-clauses/Projection";
import { mixin } from "./utils/mixin";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Return extends WithOrder {}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/return/ | Cypher Documentation}
 * @group Clauses
 */
@mixin(WithOrder)
export class Return extends Clause {
    private readonly projection: Projection;
    private isDistinct = false;

    constructor(...columns: Array<"*" | ProjectionColumn>) {
        super();
        this.projection = new Projection(columns);
    }

    public addColumns(...columns: Array<"*" | ProjectionColumn>): this {
        this.projection.addColumns(columns);
        return this;
    }

    public distinct(): this {
        this.isDistinct = true;
        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const projectionStr = this.projection.getCypher(env);
        const orderStr = compileCypherIfExists(this.orderByStatement, env, { prefix: "\n" });
        const distinctStr = this.isDistinct ? " DISTINCT" : "";

        return `RETURN${distinctStr} ${projectionStr}${orderStr}`;
    }
}
