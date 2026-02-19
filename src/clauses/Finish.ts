/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { Clause } from "./Clause.js";

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/finish/ | Cypher Documentation}
 * @group Clauses
 * @since Neo4j 5.19
 */
export class Finish extends Clause {
    /** @internal */
    public getCypher(): string {
        return "FINISH";
    }
}
