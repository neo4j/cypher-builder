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

import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { Expr } from "../../types";
import { compileCypherIfExists } from "../../utils/compile-cypher-if-exists";
import { normalizeExpr } from "../../utils/normalize-variable";

/** @group Clauses */
export type Order = "ASC" | "DESC";

type OrderProjectionElement = [Expr, Order];

export class OrderBy extends CypherASTNode {
    private readonly exprs: OrderProjectionElement[] = [];

    private skipClause: Skip | undefined;
    private limitClause: Limit | undefined;

    public addOrderElements(exprs: OrderProjectionElement[]): void {
        this.exprs.push(...exprs);
    }

    public skip(offset: number | Expr): void {
        const offsetVar = normalizeExpr(offset);
        this.skipClause = new Skip(offsetVar);
    }

    public offset(offset: number | Expr): void {
        const offsetVar = normalizeExpr(offset);
        this.skipClause = new Skip(offsetVar, true);
    }

    public limit(limit: number | Expr): void {
        const limitVar = normalizeExpr(limit);
        this.limitClause = new Limit(limitVar);
    }

    private hasOrder(): boolean {
        return this.exprs.length > 0;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        let orderStr = "";
        const skipStr = compileCypherIfExists(this.skipClause, env, { prefix: "\n" });
        const limitStr = compileCypherIfExists(this.limitClause, env, { prefix: "\n" });

        if (this.hasOrder()) {
            const exprStr = this.exprs
                .map(([expr, order]) => {
                    return `${expr.getCypher(env)} ${order}`;
                })
                .join(", ");

            orderStr = `ORDER BY ${exprStr}`;
        }

        return `${orderStr}${skipStr}${limitStr}`;
    }
}

class Skip extends CypherASTNode {
    private readonly value: Expr;
    private readonly useOffset;

    constructor(value: Expr, useOffset: boolean = false) {
        super();
        this.value = value;
        this.useOffset = useOffset;
    }

    public getCypher(env: CypherEnvironment): string {
        const valueStr = this.value.getCypher(env);
        const skipStr = this.useOffset ? "OFFSET" : "SKIP";
        return `${skipStr} ${valueStr}`;
    }
}

class Limit extends CypherASTNode {
    private readonly value: Expr;

    constructor(value: Expr) {
        super();
        this.value = value;
    }

    public getCypher(env: CypherEnvironment): string {
        const valueStr = this.value.getCypher(env);
        return `LIMIT ${valueStr}`;
    }
}
