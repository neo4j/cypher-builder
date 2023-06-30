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

import type { Expr } from "../../types";
import { CypherFunction } from "./CypherFunctions";

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-coalesce)
 * @group Cypher Functions
 */
export function coalesce(expr: Expr, ...optionalExpr: Expr[]): CypherFunction {
    return new CypherFunction("coalesce", [expr, ...optionalExpr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-elementid)
 * @group Cypher Functions
 */
export function elementId(variable: Expr): CypherFunction {
    return new CypherFunction("elementId", [variable]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-randomuuid)
 * @group Cypher Functions
 */
export function randomUUID(): CypherFunction {
    return new CypherFunction("randomUUID");
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-id)
 * @group Cypher Functions
 */
export function id(variable: Expr): CypherFunction {
    return new CypherFunction("id", [variable]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-size)
 * @group Cypher Functions
 * @category List
 */
export function size(expr: Expr): CypherFunction {
    return new CypherFunction("size", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-head)
 * @group Cypher Functions
 * @category List
 */
export function head(expr: Expr): CypherFunction {
    return new CypherFunction("head", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-last)
 * @group Cypher Functions
 * @category List
 */
export function last(expr: Expr): CypherFunction {
    return new CypherFunction("last", [expr]);
}
