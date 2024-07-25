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

import type { Literal } from "../../../Cypher";
import { CypherProcedure } from "../../../procedures/CypherProcedure";
import type { Expr } from "../../../types";
import { normalizeVariable } from "../../../utils/normalize-variable";

const VECTOR_NAMESPACE = "db.index.vector";

/** Returns all labels in the database
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_index_vector_queryNodes)
 * @group Procedures
 */
export function queryNodes(
    indexName: string | Literal<string>,
    numberOfNearestNeighbours: number,
    query: Expr
): CypherProcedure<"node" | "score"> {
    const procedureArgs = getVectorArguments(indexName, numberOfNearestNeighbours, query);

    return new CypherProcedure("queryNodes", procedureArgs, VECTOR_NAMESPACE);
}

/** Returns all labels in the database
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db.index.vector.queryRelationships)
 * @group Procedures
 */
export function queryRelationships(
    indexName: string | Literal<string>,
    numberOfNearestNeighbours: number,
    query: Expr
): CypherProcedure<"relationship" | "score"> {
    const procedureArgs = getVectorArguments(indexName, numberOfNearestNeighbours, query);

    return new CypherProcedure("queryRelationships", procedureArgs, VECTOR_NAMESPACE);
}

function getVectorArguments(
    indexName: string | Literal<string>,
    numberOfNearestNeighbours: number,
    query: Expr
): Expr[] {
    const indexNameVar = normalizeVariable(indexName);
    const numberOfNearestNeighboursVar = normalizeVariable(numberOfNearestNeighbours);

    const procedureArgs: Expr[] = [indexNameVar, numberOfNearestNeighboursVar, query];
    return procedureArgs;
}
