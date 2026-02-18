/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
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
