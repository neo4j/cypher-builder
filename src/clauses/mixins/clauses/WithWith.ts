/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { With } from "../../../index.js";
import type { WithProjection } from "../../With.js";
import { MixinClause } from "../Mixin.js";

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
