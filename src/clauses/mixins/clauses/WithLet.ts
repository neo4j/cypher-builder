/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { LetBinding } from "../../Let";
import { MixinClause } from "../Mixin";

// We need barrel import from Cypher instead of local file to avoid issues with circular dependencies in mixins
import { Let } from "../../../Cypher";

export abstract class WithLet extends MixinClause {
    /** Append a {@link Let} clause.
     * @see {@link https://neo4j.com/docs/cypher-manual/25/clauses/let/ | Cypher Documentation}
     * @since Neo4j 2025.06
     */
    public let(clause: Let): Let;
    public let(...bindings: LetBinding[]): Let;
    public let(clauseOrBinding: Let | LetBinding, ...bindings: LetBinding[]): Let {
        const letClause = this.getLetClause(clauseOrBinding, bindings);
        this.addNextClause(letClause);
        return letClause;
    }

    private getLetClause(clauseOrBinding: Let | LetBinding, bindings: LetBinding[]): Let {
        if (clauseOrBinding instanceof Let) {
            return clauseOrBinding;
        } else {
            return new Let(clauseOrBinding, ...bindings);
        }
    }
}
