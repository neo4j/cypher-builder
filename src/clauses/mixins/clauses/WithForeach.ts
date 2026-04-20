/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Variable } from "../../../references/Variable";
import { MixinClause } from "../Mixin";

// We need barrel import from Cypher instead of local file to avoid issues with circular dependencies in mixins
import { Foreach } from "../../../Cypher";

export abstract class WithForeach extends MixinClause {
    /** Add a {@link Foreach} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/foreach/ | Cypher Documentation}
     */

    public foreach(variable: Variable): Foreach {
        const foreach = new Foreach(variable);
        this.addNextClause(foreach);
        return foreach;
    }
}
