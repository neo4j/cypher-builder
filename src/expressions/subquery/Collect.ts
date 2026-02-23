/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Clause } from "../../index.js";
import type { CypherEnvironment } from "../../Environment.js";
import { padBlock } from "../../utils/pad-block.js";
import { Subquery } from "./Subquery.js";

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/subqueries/collect/ | Cypher Documentation}
 * @group Subqueries
 */
export class Collect extends Subquery {
    // Collect doesn't support a Pattern. The constructor is overriden to only support a Clause
    constructor(clause: Clause) {
        super(clause);
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const subQueryStr = this.subquery.getCypher(env);
        const paddedSubQuery = padBlock(subQueryStr);
        return `COLLECT {\n${paddedSubQuery}\n}`;
    }
}
