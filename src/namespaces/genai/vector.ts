/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Literal, Param } from "../../Cypher";
import { CypherFunction } from "../../expressions/functions/CypherFunctions";
import { CypherProcedure } from "../../procedures/CypherProcedure";
import type { Expr } from "../../types";
import { normalizeMap, normalizeVariable } from "../../utils/normalize-variable";

const GENAI_VECTOR_NAMESPACE = "genai.vector";

/** Encode a given resource as a vector using the named provider.
 * @see [Neo4j Documentation](https://neo4j.com/docs/cypher-manual/current/functions/#header-query-functions-genai)
 * @group Functions
 */
export function encode(
    resource: Expr,
    provider: string | Literal<string> | Param,
    configuration: Record<string, string | number | Literal | Param>
): CypherFunction {
    return new CypherFunction(
        "encode",
        [resource, normalizeVariable(provider), normalizeMap(configuration)],
        GENAI_VECTOR_NAMESPACE
    );
}

/** Encode a given batch of resources as vectors using the named provider.
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_genai_vector_encodeBatch)
 * @group Procedures
 */
export function encodeBatch(
    resources: Expr,
    provider: string | Literal<string> | Param,
    configuration: Record<string, string | number | Literal | Param>
): CypherProcedure<"index" | "resource" | "vector"> {
    return new CypherProcedure(
        "encodeBatch",
        [resources, normalizeVariable(provider), normalizeMap(configuration)],
        GENAI_VECTOR_NAMESPACE
    );
}
