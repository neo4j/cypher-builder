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

import { Raw, type Pattern } from "../..";
import type { Expr } from "../../types";
import { CypherFunction } from "./CypherFunctions";

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-coalesce)
 * @group Cypher Functions
 * @category Scalar
 */
export function coalesce(expr: Expr, ...optionalExpr: Expr[]): CypherFunction {
    return new CypherFunction("coalesce", [expr, ...optionalExpr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-elementid)
 * @group Cypher Functions
 * @category Scalar
 */
export function elementId(variable: Expr): CypherFunction {
    return new CypherFunction("elementId", [variable]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-endnode)
 * @group Cypher Functions
 * @category Scalar
 */
export function endNode(relationship: Expr): CypherFunction {
    return new CypherFunction("endNode", [relationship]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-head)
 * @group Cypher Functions
 * @category Scalar
 */
export function head(expr: Expr): CypherFunction {
    return new CypherFunction("head", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-id)
 * @group Cypher Functions
 * @category Scalar
 * @deprecated Use {@link elementId} instead
 */
export function id(variable: Expr): CypherFunction {
    return new CypherFunction("id", [variable]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-last)
 * @group Cypher Functions
 * @category Scalar
 */
export function last(expr: Expr): CypherFunction {
    return new CypherFunction("last", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-length)
 * @group Cypher Functions
 * @category Scalar
 */
export function length(path: Expr): CypherFunction {
    return new CypherFunction("length", [path]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-properties)
 * @group Cypher Functions
 * @category Scalar
 */
export function properties(expr: Expr): CypherFunction {
    return new CypherFunction("properties", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-randomuuid)
 * @group Cypher Functions
 * @category Scalar
 */
export function randomUUID(): CypherFunction {
    return new CypherFunction("randomUUID");
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-size)
 * @group Cypher Functions
 * @category Scalar
 */
export function size(expr: Expr): CypherFunction;
/** @deprecated size() with pattern is deprecated in Neo4j 5 */
export function size(expr: Pattern): CypherFunction;
export function size(expr: Expr | Pattern): CypherFunction {
    // Support for patterns in size() in Neo4j 4
    // Using Raw to avoid adding Patterns to CypherFunction
    const sizeParam = new Raw((env) => {
        return env.compile(expr);
    });

    return new CypherFunction("size", [sizeParam]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-startnode)
 * @group Cypher Functions
 * @category Scalar
 */
export function startNode(relationship: Expr): CypherFunction {
    return new CypherFunction("startNode", [relationship]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-timestamp)
 * @group Cypher Functions
 * @category Scalar
 */
export function timestamp(): CypherFunction {
    return new CypherFunction("timestamp");
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-toboolean)
 * @group Cypher Functions
 * @category Scalar
 */
export function toBoolean(expr: Expr): CypherFunction {
    return new CypherFunction("toBoolean", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-tobooleanornull)
 * @group Cypher Functions
 * @category Scalar
 */
export function toBooleanOrNull(expr: Expr): CypherFunction {
    return new CypherFunction("toBooleanOrNull", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-tofloat)
 * @group Cypher Functions
 * @category Scalar
 */
export function toFloat(expr: Expr): CypherFunction {
    return new CypherFunction("toFloat", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-tofloatornull)
 * @group Cypher Functions
 * @category Scalar
 */
export function toFloatOrNull(expr: Expr): CypherFunction {
    return new CypherFunction("toFloatOrNull", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-tointeger)
 * @group Cypher Functions
 * @category Scalar
 */
export function toInteger(expr: Expr): CypherFunction {
    return new CypherFunction("toInteger", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-tointegerornull)
 * @group Cypher Functions
 * @category Scalar
 */
export function toIntegerOrNull(expr: Expr): CypherFunction {
    return new CypherFunction("toIntegerOrNull", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-type)
 * @group Cypher Functions
 * @category Scalar
 */
export function type(relationship: Expr): CypherFunction {
    return new CypherFunction("type", [relationship]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-valueType)
 * @group Cypher Functions
 * @category Scalar
 */
export function valueType(expr: Expr): CypherFunction {
    return new CypherFunction("valueType", [expr]);
}

/** Alias of size()
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-char_length)
 * @group Cypher Functions
 * @category Scalar
 */
export function char_length(expr: Expr): CypherFunction {
    return new CypherFunction("char_length", [expr]);
}

/** Alias of size()
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-character_length)
 * @group Cypher Functions
 * @category Scalar
 * @version Neo4j 5.13
 */
export function character_length(expr: Expr): CypherFunction {
    return new CypherFunction("character_length", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-nullIf)
 * @group Cypher Functions
 * @category Scalar
 * @version Neo4j 5.14
 */
export function nullIf(expr1: Expr, expr2: Expr): CypherFunction {
    return new CypherFunction("nullIf", [expr1, expr2]);
}
