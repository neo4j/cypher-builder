/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../../index";
import { MixinClause } from "../Mixin";

// We need barrel import from Cypher instead of local file to avoid issues with circular dependencies in mixins
import type { Foreach } from "../../../index";

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
