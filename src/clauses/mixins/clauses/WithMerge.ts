/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Pattern } from "../../../index";
import { MixinClause } from "../Mixin";

// We need barrel import from Cypher instead of local file to avoid issues with circular dependencies in mixins
import { Merge } from "../../../index";

export abstract class WithMerge extends MixinClause {
    /** Add a {@link Merge} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/merge/ | Cypher Documentation}
     */

    public merge(clauseOrPattern: Merge | Pattern): Merge {
        if (clauseOrPattern instanceof Merge) {
            this.addNextClause(clauseOrPattern);
            return clauseOrPattern;
        }

        const matchClause = new Merge(clauseOrPattern);
        this.addNextClause(matchClause);

        return matchClause;
    }
}
