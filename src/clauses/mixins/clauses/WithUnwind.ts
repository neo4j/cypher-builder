/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { UnwindProjectionColumn } from "../../../index";
import { MixinClause } from "../Mixin";

// We need barrel import from Cypher instead of local file to avoid issues with circular dependencies in mixins
import { Unwind } from "../../../Cypher";

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
