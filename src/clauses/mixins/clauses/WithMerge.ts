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
import { Merge } from "../../..";
import type { NodeRef } from "../../../references/NodeRef";
import { MixinClause } from "../Mixin";

export abstract class WithMerge extends MixinClause {
    /** Add a {@link Merge} clause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/merge/)
     */
    public merge(clause: Merge): Merge;
    public merge(pattern: NodeRef | Pattern): Merge;
    public merge(clauseOrPattern: Merge | NodeRef | Pattern): Merge {
        if (clauseOrPattern instanceof Merge) {
            this.addNextClause(clauseOrPattern);
            return clauseOrPattern;
        }

        const matchClause = new Merge(clauseOrPattern);
        this.addNextClause(matchClause);

        return matchClause;
    }
}
