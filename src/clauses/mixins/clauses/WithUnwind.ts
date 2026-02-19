/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { UnwindProjectionColumn } from "../../Unwind.js";
import { Unwind } from "../../Unwind.js";
import { MixinClause } from "../Mixin.js";

export abstract class WithUnwind extends MixinClause {
    /** Append an {@link Unwind} clause.
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/unwind/ | Cypher Documentation}
     */
    public unwind(clause: Unwind): Unwind;
    public unwind(projection: UnwindProjectionColumn): Unwind;
    public unwind(clauseOrColumn: Unwind | UnwindProjectionColumn): Unwind {
        const unwindClause = this.getUnwindClause(clauseOrColumn);
        this.addNextClause(unwindClause);
        return unwindClause;
    }

    private getUnwindClause(clauseOrColumn: Unwind | UnwindProjectionColumn): Unwind {
        if (clauseOrColumn instanceof Unwind) {
            return clauseOrColumn;
        } else {
            return new Unwind(clauseOrColumn);
        }
    }
}
