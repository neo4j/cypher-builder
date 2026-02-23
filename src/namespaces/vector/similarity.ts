/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherFunction } from "../../expressions/functions/CypherFunctions.js";
import type { Expr } from "../../types.js";

const VECTOR_SIMILARITY_NAMESPACE = "vector.similarity";

/** Returns a FLOAT representing the similarity between the argument vectors based on their Euclidean distance.
 * @see [Neo4j Documentation](https://neo4j.com/docs/cypher-manual/current/functions/vector/#functions-similarity-euclidean)
 * @group Functions
 * @since Neo4j 5.18
 */
export function euclidean(a: Expr, b: Expr): CypherFunction {
    return new CypherFunction("euclidean", [a, b], VECTOR_SIMILARITY_NAMESPACE);
}

/** Returns a FLOAT representing the similarity between the argument vectors based on their cosine.
 * @see [Neo4j Documentation](https://neo4j.com/docs/cypher-manual/current/functions/vector/#functions-similarity-cosine)
 * @group Functions
 * @since Neo4j 5.18
 */
export function cosine(a: Expr, b: Expr): CypherFunction {
    return new CypherFunction("cosine", [a, b], VECTOR_SIMILARITY_NAMESPACE);
}
