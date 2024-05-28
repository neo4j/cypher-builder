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

import type { CypherProcedure, VoidCypherProcedure } from "../../../procedures/CypherProcedure";
import { MixinClause } from "../Mixin";

export abstract class WithCallProcedure extends MixinClause {
    /** Add a call {@link Procedure} clause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/call/)
     */
    public callProcedure<T extends CypherProcedure | VoidCypherProcedure>(procedure: T): T {
        this.addNextClause(procedure);
        return procedure;
    }
}
