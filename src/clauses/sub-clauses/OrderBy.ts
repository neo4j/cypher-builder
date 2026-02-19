/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherASTNode } from "../../CypherASTNode.js";
import type { CypherEnvironment } from "../../Environment.js";
import type { Expr } from "../../types.js";
import { compileCypherIfExists } from "../../utils/compile-cypher-if-exists.js";
import { normalizeExpr } from "../../utils/normalize-variable.js";

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
