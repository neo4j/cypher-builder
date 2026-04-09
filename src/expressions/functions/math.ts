/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Expr } from "../../Cypher";
import { Literal } from "../../Cypher";
import { filterTruthy } from "../../utils/filter-truthy";
import { CypherFunction } from "./CypherFunctions";

/** Returns the absolute value of an `INTEGER` or `FLOAT`
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-abs | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function abs(expr: Expr): CypherFunction {
    return new CypherFunction("abs", [expr]);
}

/** Returns the smallest FLOAT that is greater than or equal to a number and equal to an `INTEGER`
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-ceil | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function ceil(expr: Expr): CypherFunction {
    return new CypherFunction("ceil", [expr]);
}

/** Returns the largest `FLOAT` that is less than or equal to a number and equal to an `INTEGER`
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-floor | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function floor(expr: Expr): CypherFunction {
    return new CypherFunction("floor", [expr]);
}

/** Returns whether the given `INTEGER` or `FLOAT` is `NaN`
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-isnan | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function cypherIsNaN(expr: Expr): CypherFunction {
    return new CypherFunction("isNaN", [expr]);
}

/** Returns a random `FLOAT` in the range from 0 (inclusive) to 1 (exclusive)
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-rand | Cypher Documentation}
 * @group Functions
 * @category Math
 */
export function rand(): CypherFunction {
    return new CypherFunction("rand");
}

/** Precision mode for `Cypher.round()`
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

/** Returns the signum of an `INTEGER` or `FLOAT`: 0 if the number is 0, -1 for any negative number, and 1 for any positive number
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

/** Returns the hyperbolic cosine
 * @see {@link https://neo4j.com/docs/cypher-manual/25/functions/mathematical-trigonometric/#functions-cosh | Cypher Documentation}
 * @group Functions
 * @category Math
 * @since Neo4j 2025.06
 */
export function cosh(expr: Expr): CypherFunction {
    return new CypherFunction("cosh", [expr]);
}

/** Returns the hyperbolic cotangent
 * @see {@link https://neo4j.com/docs/cypher-manual/25/functions/mathematical-trigonometric/#functions-coth | Cypher Documentation}
 * @group Functions
 * @category Math
 * @since Neo4j 2025.06
 */
export function coth(expr: Expr): CypherFunction {
    return new CypherFunction("coth", [expr]);
}

/** Returns the hyperbolic sine
 * @see {@link https://neo4j.com/docs/cypher-manual/25/functions/mathematical-trigonometric/#functions-sinh | Cypher Documentation}
 * @group Functions
 * @category Math
 * @since Neo4j 2025.06
 */
export function sinh(expr: Expr): CypherFunction {
    return new CypherFunction("sinh", [expr]);
}

/** Returns the hyperbolic tangent
 * @see {@link https://neo4j.com/docs/cypher-manual/25/functions/mathematical-trigonometric/#functions-tanh | Cypher Documentation}
 * @group Functions
 * @category Math
 * @since Neo4j 2025.06
 */
export function tanh(expr: Expr): CypherFunction {
    return new CypherFunction("tanh", [expr]);
}
