/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../../Environment.js";
import { padBlock } from "../../utils/pad-block.js";
import { Subquery } from "./Subquery.js";

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#existential-subqueries | Cypher Documentation}
 * @group Subqueries
 */
export class Exists extends Subquery {
    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const subQueryStr = this.subquery.getCypher(env);
        const paddedSubQuery = padBlock(subQueryStr);
        return `EXISTS {\n${paddedSubQuery}\n}`;
    }
}
