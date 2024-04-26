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
import { Create } from "../../..";
import type { NodeRef } from "../../../references/NodeRef";
import { MixinClause } from "../Mixin";

export abstract class WithCreate extends MixinClause {
    /** Add a {@link Create} clause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/create/)
     */
    public create(clause: Create): Create;
    public create(pattern: Pattern): Create;
    /** @deprecated Use {@link Pattern} instead */
    public create(pattern: NodeRef | Pattern): Create;
    public create(clauseOrPattern: Create | NodeRef | Pattern): Create {
        if (clauseOrPattern instanceof Create) {
            this.addNextClause(clauseOrPattern);
            return clauseOrPattern;
        }

        const matchClause = new Create(clauseOrPattern);
        this.addNextClause(matchClause);

        return matchClause;
    }
}
