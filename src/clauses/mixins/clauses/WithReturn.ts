/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { Return } from "../../Return.js";
import type { ProjectionColumn } from "../../sub-clauses/Projection.js";
import { MixinClause } from "../Mixin.js";

export abstract class WithReturn extends MixinClause {
    /** Append a {@link Return} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/return/ | Cypher Documentation}
     */
    public return(clause: Return): Return;
    public return(...columns: Array<"*" | ProjectionColumn>): Return;
    public return(clauseOrColumn: Return | "*" | ProjectionColumn, ...columns: Array<"*" | ProjectionColumn>): Return {
        const returnClause = this.getReturnClause(clauseOrColumn, columns);
        this.addNextClause(returnClause);
        return returnClause;
    }

    private getReturnClause(
        clauseOrColumn: Return | "*" | ProjectionColumn,
        columns: Array<"*" | ProjectionColumn>
    ): Return {
        if (clauseOrColumn instanceof Return) {
            return clauseOrColumn;
        } else {
            return new Return(clauseOrColumn, ...columns);
        }
    }
}
