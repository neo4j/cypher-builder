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

import type { DeleteInput } from "../../sub-clauses/Delete";
import { DeleteClause } from "../../sub-clauses/Delete";
import { Mixin } from "../Mixin";

export abstract class WithDelete extends Mixin {
    protected deleteClause: DeleteClause | undefined;

    /** Add a `DELETE` subclause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/delete/ | Cypher Documentation}
     */
    public delete(...deleteInput: DeleteInput): this {
        this.createDeleteClause(deleteInput);
        return this;
    }

    /** Adds a `DETACH DELETE` subclause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/delete/ | Cypher Documentation}
     */
    public detachDelete(...deleteInput: DeleteInput): this {
        const deleteClause = this.createDeleteClause(deleteInput);
        deleteClause.detach();
        return this;
    }

    /** Add a `NODETACH DELETE` subclause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/delete/#delete-nodetach | Cypher Documentation}
     * @since Neo4j 5.14
     */
    public noDetachDelete(...deleteInput: DeleteInput): this {
        const deleteClause = this.createDeleteClause(deleteInput);
        deleteClause.noDetach();
        return this;
    }

    private createDeleteClause(deleteInput: DeleteInput): DeleteClause {
        this.deleteClause = new DeleteClause(this, deleteInput);
        return this.deleteClause;
    }
}
