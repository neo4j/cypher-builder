/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
