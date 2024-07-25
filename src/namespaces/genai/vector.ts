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
