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

import type { Expr } from "../../Cypher";
import { Literal } from "../../Cypher";
import { filterTruthy } from "../../utils/filter-truthy";
import { CypherFunction } from "./CypherFunctions";

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-abs | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function abs(expr: Expr): CypherFunction {
    return new CypherFunction("abs", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-ceil | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function ceil(expr: Expr): CypherFunction {
    return new CypherFunction("ceil", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-floor | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function floor(expr: Expr): CypherFunction {
    return new CypherFunction("floor", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-isnan | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function cypherIsNaN(expr: Expr): CypherFunction {
    return new CypherFunction("isNaN", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-rand | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function rand(): CypherFunction {
    return new CypherFunction("rand");
}

/**
 * Precision mode for `Cypher.round()`
 * @group Functions
 * @category Math
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-round3 | Cypher Documentation}
 * @see {@link round}
 */
export type ROUND_PRECISION_MODE = "UP" | "DOWN" | "CEILING" | "FLOOR" | "HALF_UP" | "HALF_DOWN" | "HALF_EVEN";

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-round | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function round(expr: Expr, precision?: Expr | number, mode?: ROUND_PRECISION_MODE): CypherFunction {
    let precisionExpr: Expr | undefined;
    const modeExpr = mode ? new Literal(mode) : undefined;

    if (typeof precision === "number") {
        precisionExpr = new Literal(precision);
    } else {
        precisionExpr = precision;
    }

    return new CypherFunction("round", filterTruthy([expr, precisionExpr, modeExpr]));
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-sign | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function sign(expr: Expr): CypherFunction {
    return new CypherFunction("sign", [expr]);
}

/** Cypher function `e()` that returns the returns the base of the natural logarithm.
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-logarithmic/#functions-e | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function e(): CypherFunction {
    return new CypherFunction("e");
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-logarithmic/#functions-exp | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function exp(expr: Expr): CypherFunction {
    return new CypherFunction("exp", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-logarithmic/#functions-log | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function log(expr: Expr): CypherFunction {
    return new CypherFunction("log", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-logarithmic/#functions-log10 | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function log10(expr: Expr): CypherFunction {
    return new CypherFunction("log10", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-logarithmic/#functions-sqrt | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function sqrt(expr: Expr): CypherFunction {
    return new CypherFunction("sqrt", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-trigonometric/#functions-acos | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function acos(expr: Expr): CypherFunction {
    return new CypherFunction("acos", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-trigonometric/#functions-asin | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function asin(expr: Expr): CypherFunction {
    return new CypherFunction("asin", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-trigonometric/#functions-atan | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function atan(expr: Expr): CypherFunction {
    return new CypherFunction("atan", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-trigonometric/#functions-atan2 | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function atan2(expr: Expr): CypherFunction {
    return new CypherFunction("atan2", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-trigonometric/#functions-cos | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function cos(expr: Expr): CypherFunction {
    return new CypherFunction("cos", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-trigonometric/#functions-cot | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function cot(expr: Expr): CypherFunction {
    return new CypherFunction("cot", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-trigonometric/#functions-degrees | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function degrees(expr: Expr): CypherFunction {
    return new CypherFunction("degrees", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-trigonometric/#functions-haversin | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function haversin(expr: Expr): CypherFunction {
    return new CypherFunction("haversin", [expr]);
}

/** 3.141592653589793
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-trigonometric/#functions-pi | Cypher Documentation}
 * @see https://www.piday.org/
 * @group Functions
 * @category Math
 */
export function pi(): CypherFunction {
    return new CypherFunction("pi");
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-trigonometric/#functions-radians | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function radians(expr: Expr): CypherFunction {
    return new CypherFunction("radians", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-trigonometric/#functions-sin | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function sin(expr: Expr): CypherFunction {
    return new CypherFunction("sin", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-trigonometric/#functions-tan | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function tan(expr: Expr): CypherFunction {
    return new CypherFunction("tan", [expr]);
}
