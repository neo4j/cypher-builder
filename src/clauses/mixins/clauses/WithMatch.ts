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
import { MixinClause } from "../Mixin";

export abstract class WithMatch extends MixinClause {
    /** Add a {@link Match} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/match/ | Cypher Documentation}
     */

    public match(clauseOrPattern: Match | Pattern): Match {
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

    public optionalMatch(pattern: Pattern): OptionalMatch {
        const matchClause = new OptionalMatch(pattern);
        this.addNextClause(matchClause);

        return matchClause;
    }
}
