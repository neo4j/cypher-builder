/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Pattern } from "../../..";
import { Match, OptionalMatch } from "../../..";
import type { NodeRef } from "../../../references/NodeRef";
import { MixinClause } from "../Mixin";

export abstract class WithMatch extends MixinClause {
    /** Add a {@link Match} clause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/match/)
     */
    public match(clause: Match): Match;
    public match(pattern: Pattern): Match;
    /** @deprecated Use {@link Pattern} instead */
    public match(pattern: NodeRef | Pattern): Match;
    public match(clauseOrPattern: Match | NodeRef | Pattern): Match {
        if (clauseOrPattern instanceof Match) {
            this.addNextClause(clauseOrPattern);
            return clauseOrPattern;
        }

        const matchClause = new Match(clauseOrPattern);
        this.addNextClause(matchClause);

        return matchClause;
    }

    /** Add an {@link OptionalMatch} clause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/optional-match/)
     */
    public optionalMatch(pattern: Pattern): OptionalMatch;
    /** @deprecated Use {@link Pattern} instead */
    public optionalMatch(pattern: NodeRef | Pattern): OptionalMatch;
    public optionalMatch(pattern: NodeRef | Pattern): OptionalMatch {
        const matchClause = new OptionalMatch(pattern);
        this.addNextClause(matchClause);

        return matchClause;
    }
}
