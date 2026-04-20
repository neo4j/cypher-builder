/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { MatchClausePattern } from "../../Match";
import { MixinClause } from "../Mixin";

// We need barrel import from Cypher instead of local file to avoid issues with circular dependencies in mixins
import { Match, OptionalMatch } from "../../../Cypher";

export abstract class WithMatch extends MixinClause {
    /** Add a {@link Match} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/match/ | Cypher Documentation}
     */

    public match(clauseOrPattern: Match | MatchClausePattern): Match {
        if (clauseOrPattern instanceof Match) {
            this.addNextClause(clauseOrPattern);
            return clauseOrPattern;
        }

        const matchClause = new Match(clauseOrPattern);
        this.addNextClause(matchClause);

        return matchClause;
    }

    /** Add an {@link OptionalMatch} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/optional-match/ | Cypher Documentation}
     */

    public optionalMatch(clauseOrPattern: OptionalMatch | MatchClausePattern): OptionalMatch {
        if (clauseOrPattern instanceof OptionalMatch) {
            this.addNextClause(clauseOrPattern);
            return clauseOrPattern;
        }
        const matchClause = new OptionalMatch(clauseOrPattern);
        this.addNextClause(matchClause);

        return matchClause;
    }
}
