/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Foreach } from "../../..";
import Cypher from "../../..";
import { MixinClause } from "../Mixin";

export abstract class WithForeach extends MixinClause {
    /** Add a {@link Foreach} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/foreach/ | Cypher Documentation}
     */

    public foreach(variable: Cypher.Variable): Foreach {
        const foreach = new Cypher.Foreach(variable);
        this.addNextClause(foreach);
        return foreach;
    }
}
