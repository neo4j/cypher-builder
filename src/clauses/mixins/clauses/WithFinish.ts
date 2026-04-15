/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { MixinClause } from "../Mixin";

// We need barrel import from Cypher instead of local file to avoid issues with circular dependencies in mixins
import { Finish } from "../../../index";

export abstract class WithFinish extends MixinClause {
    /** Append a {@link Finish} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/finish/ | Cypher Documentation}
     */
    public finish(): Finish {
        const finishClause = new Finish();
        this.addNextClause(finishClause);

        return finishClause;
    }
}
