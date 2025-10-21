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

import type { CypherASTNode } from "../CypherASTNode";
import type { CypherEnvironment } from "../Environment";
import { Clause } from "./Clause";

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/union/ | Cypher Documentation}
 * @group Clauses
 */
export class Union extends Clause {
    private readonly subqueries: CypherASTNode[] = [];

    private unionType: "ALL" | "DISTINCT" | undefined;

    constructor(...subqueries: Clause[]) {
        super();
        this.subqueries = subqueries.map((s) => s.getRoot());
        this.addChildren(...subqueries);
    }

    public all(): this {
        this.unionType = "ALL";
        return this;
    }

    /**
     * Adds the clause `DISTINCT` after `UNION`
     * @since Neo4j.19
     */
    public distinct(): this {
        this.unionType = "DISTINCT";
        return this;
    }

    /**
     * If importWithCypher is provided, it will be added at the beginning of each subquery except first
     *  @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const subqueriesStr = this.subqueries.map((s) => s.getCypher(env));
        const unionTypeStr = this.unionType ? ` ${this.unionType}` : "";

        return subqueriesStr.join(`\nUNION${unionTypeStr}\n`);
    }
}
