/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Predicate } from "../../../types";
import { Filter } from "../../Filter";
import { MixinClause } from "../Mixin";

export abstract class WithFilter extends MixinClause {
    /** Add a {@link Filter} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/filter/ | Cypher Documentation}
     */

    public filter(predicate: Predicate): Filter {
        const matchClause = new Filter(predicate);
        this.addNextClause(matchClause);

        return matchClause;
    }
}
