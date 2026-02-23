/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { DeleteInput } from "../../sub-clauses/Delete.js";
import { DeleteClause } from "../../sub-clauses/Delete.js";
import { Mixin } from "../Mixin.js";

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
