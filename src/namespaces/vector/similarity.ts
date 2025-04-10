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

import { CypherFunction } from "../../expressions/functions/CypherFunctions";
import type { Expr } from "../../types";

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
