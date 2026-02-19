/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherASTNode } from "../CypherASTNode.js";
import type { CypherEnvironment } from "../Environment.js";
import { Clause } from "./Clause.js";

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/5/clauses/use/ | Cypher Documentation}
 * @group Clauses
 */
export class Use extends Clause {
    private readonly graph: string;
    private readonly subClause: CypherASTNode;

    constructor(graph: string, subClause: Clause) {
        super();
        this.subClause = subClause.getRoot();
        this.graph = graph;
        this.addChildren(this.subClause);
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const subClauseStr = this.subClause.getCypher(env);
        return `USE ${this.graph}\n${subClauseStr}`;
    }
}
