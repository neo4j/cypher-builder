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

import type { CypherEnvironment } from "../../Environment";
import type { Expr, NormalizationType } from "../../types";
import { filterTruthy } from "../../utils/filter-truthy";
import { normalizeExpr } from "../../utils/normalize-variable";

import { CypherFunction } from "./CypherFunctions";

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/#functions-btrim | Cypher Documentation}
 * @group Functions
 * @category String
 */
export function btrim(original: string | Expr, trimCharacter?: string | Expr): CypherFunction {
    const normalizedOriginal = normalizeExpr(original);
    const normalizedTrimCharacter = trimCharacter ? normalizeExpr(trimCharacter) : undefined;
    return new CypherFunction("btrim", filterTruthy([normalizedOriginal, normalizedTrimCharacter]));
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/#functions-left | Cypher Documentation}
 * @group Functions
 * @category String
 */
export function left(original: Expr, length: Expr): CypherFunction {
    return new CypherFunction("left", [original, length]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/#functions-lower | Cypher Documentation}
 * @group Functions
 * @category String
 */
export function lower(original: Expr): CypherFunction {
    return new CypherFunction("lower", [original]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/ | Cypher Documentation}
 * @group Functions
 * @category String
 */
export function ltrim(original: Expr | string, trimCharacter?: string | Expr): CypherFunction {
    const normalizedOriginal = normalizeExpr(original);
    const normalizedTrimCharacter = trimCharacter ? normalizeExpr(trimCharacter) : undefined;
    return new CypherFunction("ltrim", filterTruthy([normalizedOriginal, normalizedTrimCharacter]));
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/ | Cypher Documentation}
 * @group Functions
 * @category String
 * @param normalForm - A string with the normal form to use or a Cypher expression
 * @example `Cypher.normalize(param, "NFC")`
 */
export function normalize(input: Expr, normalForm?: NormalizationType | Expr): CypherFunction {
    const normalFormExpr = normalForm ? normalizeExpr(normalForm) : undefined;
    return new CypherFunction("normalize", filterTruthy([input, normalFormExpr]));
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/ | Cypher Documentation}
 * @group Functions
 * @category String
 */
export function replace(original: Expr, search: Expr, replace: Expr): CypherFunction {
    return new CypherFunction("replace", [original, search, replace]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/ | Cypher Documentation}
 * @group Functions
 * @category List
 * @category String
 */
export function right(original: Expr, length: Expr): CypherFunction {
    return new CypherFunction("right", [original, length]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/ | Cypher Documentation}
 * @group Functions
 * @category String
 */
export function rtrim(original: Expr | string, trimCharacter?: string | Expr): CypherFunction {
    const normalizedOriginal = normalizeExpr(original);
    const normalizedTrimCharacter = trimCharacter ? normalizeExpr(trimCharacter) : undefined;
    return new CypherFunction("rtrim", filterTruthy([normalizedOriginal, normalizedTrimCharacter]));
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/ | Cypher Documentation}
 * @group Functions
 * @category String
 */
export function split(original: Expr, delimiter: Expr): CypherFunction {
    return new CypherFunction("split", [original, delimiter]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/ | Cypher Documentation}
 * @group Functions
 * @category String
 */
export function substring(original: Expr, start: Expr, length?: Expr): CypherFunction {
    return new CypherFunction("substring", filterTruthy([original, start, length]));
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/ | Cypher Documentation}
 * @group Functions
 * @category String
 */
export function toLower(original: Expr): CypherFunction {
    return new CypherFunction("toLower", [original]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/ | Cypher Documentation}
 * @group Functions
 * @category String
 */
export function toString(expression: Expr): CypherFunction {
    return new CypherFunction("toString", [expression]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/ | Cypher Documentation}
 * @group Functions
 * @category String
 */
export function toStringOrNull(expression: Expr): CypherFunction {
    return new CypherFunction("toStringOrNull", [expression]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/ | Cypher Documentation}
 * @group Functions
 * @category String
 */
export function toUpper(original: Expr): CypherFunction {
    return new CypherFunction("toUpper", [original]);
}

/** Implements a trim function with a trim expression `trim(BOTH 'x' FROM 'xxxhelloxxx')` */
class TrimFunction extends CypherFunction {
    private readonly typeOrInput: "BOTH" | "LEADING" | "TRAILING";
    private readonly trimChar: Expr;
    private readonly input: Expr;

    constructor(typeOrInput: "BOTH" | "LEADING" | "TRAILING", trimChar: Expr, input: Expr) {
        super("trim");
        this.typeOrInput = typeOrInput;
        this.trimChar = trimChar;
        this.input = input;
    }

    protected serializeParams(env: CypherEnvironment): string {
        const trimStr = this.trimChar.getCypher(env);
        const inputStr = this.input.getCypher(env);

        return `${this.typeOrInput} ${trimStr} FROM ${inputStr}`;
    }
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/ | Cypher Documentation}
 * @group Functions
 * @category String
 */
export function trim(type: "BOTH" | "LEADING" | "TRAILING", trimChar: Expr, input: Expr): CypherFunction;
export function trim(input: Expr): CypherFunction;
export function trim(
    typeOrInput: "BOTH" | "LEADING" | "TRAILING" | Expr,
    trimChar?: Expr,
    input?: Expr
): CypherFunction {
    if (typeof typeOrInput === "string") {
        if (!trimChar || !input) {
            throw new Error("Invalid parameters in trim. trimChar and input must be valid Expr");
        }
        return new TrimFunction(typeOrInput, trimChar, input);
    }
    return new CypherFunction("trim", [typeOrInput]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/string/#functions-upper | Cypher Documentation}
 * @group Functions
 * @category String
 */
export function upper(original: Expr): CypherFunction {
    return new CypherFunction("upper", [original]);
}
