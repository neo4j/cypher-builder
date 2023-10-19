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

import { Return } from "../../Return";
import type { ProjectionColumn } from "../../sub-clauses/Projection";
import { MixinClause } from "../Mixin";

export abstract class WithReturn extends MixinClause {
    /** Append a {@link Return} clause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/return/)
     */
    public return(clause: Return): Return;
    public return(...columns: Array<"*" | ProjectionColumn>): Return;
    public return(clauseOrColumn: Return | "*" | ProjectionColumn, ...columns: Array<"*" | ProjectionColumn>): Return {
        if (clauseOrColumn instanceof Return) {
            this.addNextClause(clauseOrColumn);
            return clauseOrColumn;
        }

        return this.addColumnsToReturnClause(clauseOrColumn, ...columns);
    }

    private addColumnsToReturnClause(...columns: Array<"*" | ProjectionColumn>): Return {
        if (!this.nextClause) {
            this.addNextClause(new Return());
        }

        if (!(this.nextClause instanceof Return)) {
            throw new Error("Invalid Return");
        }

        this.nextClause.addColumns(...columns);
        return this.nextClause;
    }
}
