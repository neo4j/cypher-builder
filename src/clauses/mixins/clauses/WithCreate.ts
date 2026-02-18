/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Pattern } from "../../..";
import { Create } from "../../..";
import { MixinClause } from "../Mixin";

export abstract class WithCreate extends MixinClause {
    /** Add a {@link Create} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/create/ | Cypher Documentation}
     */

    public create(clauseOrPattern: Create | Pattern): Create {
        if (clauseOrPattern instanceof Create) {
            this.addNextClause(clauseOrPattern);
            return clauseOrPattern;
        }

        const matchClause = new Create(clauseOrPattern);
        this.addNextClause(matchClause);

        return matchClause;
    }
}
