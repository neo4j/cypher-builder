/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherASTNode } from "../CypherASTNode";
import type { CypherEnvironment } from "../Environment";
import { padBlock } from "../utils/pad-block";
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
        const subqueriesStr = this.subqueries.map((s) => this.getSubqueryCypher(s, env));
        const unionTypeStr = this.unionType ? ` ${this.unionType}` : "";

        return subqueriesStr.join(`\nUNION${unionTypeStr}\n`);
    }

    private getSubqueryCypher(node: CypherASTNode, env: CypherEnvironment): string {
        const subqueryStr = node.getCypher(env);
        if (node instanceof Union) {
            return `{\n${padBlock(subqueryStr)}\n}`;
        }
        return subqueryStr;
    }
}
