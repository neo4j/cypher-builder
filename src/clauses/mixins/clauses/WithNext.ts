/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Clause } from "../../Clause";
import { MixinClause } from "../Mixin";

// We need barrel import from Cypher instead of local file to avoid issues with circular dependencies in mixins
import { Next } from "../../../Cypher";

export abstract class WithNext extends MixinClause {
    /** Add a {@link Next} clause to compose sequential queries
     * @see {@link https://neo4j.com/docs/cypher-manual/25/queries/composed-queries/sequential-queries/ | Cypher Documentation}
     * @since Neo4j 2025.06
     */
    public next(): Next;
    public next<T extends Clause>(clause: T): T;
    public next<T extends Clause>(clause?: T): Next | T {
        const nextSeparator = new Next(clause);
        this.addNextClause(nextSeparator);
        if (clause !== undefined) {
            return clause;
        }
        return nextSeparator;
    }
}
