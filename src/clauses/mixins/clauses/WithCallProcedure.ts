/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { MixinClause } from "../Mixin";

// These are not public, so they cannot be barrel imported, unlike other mixins
import type { CypherProcedure, VoidCypherProcedure } from "../../../procedures/CypherProcedure";

export abstract class WithCallProcedure extends MixinClause {
    /** Add a call {@link Procedure} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/call/ | Cypher Documentation}
     */
    public callProcedure<T extends CypherProcedure | VoidCypherProcedure>(procedure: T): T {
        this.addNextClause(procedure);
        return procedure;
    }
}
