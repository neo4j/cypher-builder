/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Predicate } from "../../../types";
import { MixinClause } from "../Mixin";

// We need barrel import from Cypher instead of local file to avoid issues with circular dependencies in mixins
import { Filter } from "../../../Cypher";

export abstract class WithFilter extends MixinClause {
    /** Add a {@link Filter} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/filter/ | Cypher Documentation}
     * @since Neo4j 2025.06
     */
    public filter(predicate: Predicate): Filter {
        const matchClause = new Filter(predicate);
        this.addNextClause(matchClause);

        return matchClause;
    }
}
