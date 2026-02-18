/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherProcedure, VoidCypherProcedure } from "../../../procedures/CypherProcedure.js";
import { MixinClause } from "../Mixin.js";

export abstract class WithCallProcedure extends MixinClause {
    /** Add a call {@link Procedure} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/call/ | Cypher Documentation}
     */
    public callProcedure<T extends CypherProcedure | VoidCypherProcedure>(procedure: T): T {
        this.addNextClause(procedure);
        return procedure;
    }
}
