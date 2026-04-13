/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Clause } from "../clauses/Clause";
import { CompositeClause } from "../clauses/utils/concat";

/** Concatenates multiple {@link Clause | clauses} into a single clause
 */
export function concat(...clauses: Array<Clause | undefined>): CompositeClause {
    return new CompositeClause(clauses, "\n");
}
