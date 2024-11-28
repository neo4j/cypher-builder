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

import { With } from "../../..";
import type { WithProjection } from "../../With";
import { MixinClause } from "../Mixin";

export abstract class WithWith extends MixinClause {
    /** Add a {@link With} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/with/ | Cypher Documentation}
     */
    public with(clause: With): With;
    public with(...columns: Array<"*" | WithProjection>): With;
    public with(clauseOrColumn: With | "*" | WithProjection, ...columns: Array<"*" | WithProjection>): With {
        const withClause = this.getWithClause(clauseOrColumn, columns);
        this.addNextClause(withClause);
        return withClause;
    }

    private getWithClause(clauseOrColumn: With | "*" | WithProjection, columns: Array<"*" | WithProjection>): With {
        if (clauseOrColumn instanceof With) {
            return clauseOrColumn;
        } else {
            return new With(clauseOrColumn, ...columns);
        }
    }
}
