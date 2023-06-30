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

import { Expr, Literal } from "../../Cypher";
import { filterTruthy } from "../../utils/filter-truthy";
import { CypherFunction } from "./CypherFunctions";

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-abs)
 * @group Cypher Functions
 * @category Math
 */
export function abs(expr: Expr): CypherFunction {
    return new CypherFunction("abs", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-ceil)
 * @group Cypher Functions
 * @category Math
 */
export function ceil(expr: Expr): CypherFunction {
    return new CypherFunction("ceil", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-floor)
 * @group Cypher Functions
 * @category Math
 */
export function floor(expr: Expr): CypherFunction {
    return new CypherFunction("floor", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-isnan)
 * @group Cypher Functions
 * @category Math
 */
export function isNaN(expr: Expr): CypherFunction {
    return new CypherFunction("isNaN", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-rand)
 * @group Cypher Functions
 * @category Math
 */
export function rand(): CypherFunction {
    return new CypherFunction("rand");
}

/**
 * Precision mode for `Cypher.round()`
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-round3)
 * @see {@link round}
 */
export type ROUND_PRECISION_MODE = "UP" | "DOWN" | "CEILING" | "FLOOR" | "HALF_UP" | "HALF_DOWN" | "HALF_EVEN";

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-round)
 * @group Cypher Functions
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
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-sign)
 * @group Cypher Functions
 * @category Math
 */
export function sign(expr: Expr): CypherFunction {
    return new CypherFunction("sign", [expr]);
}

/** Cypher function `e()` that returns the returns the base of the natural logarithm.
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/mathematical-logarithmic/#functions-e)
 * @group Cypher Functions
 * @category Math
 */
export function e(): CypherFunction {
    return new CypherFunction("e");
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/mathematical-logarithmic/#functions-exp)
 * @group Cypher Functions
 * @category Math
 */
export function exp(expr: Expr): CypherFunction {
    return new CypherFunction("exp", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/mathematical-logarithmic/#functions-log)
 * @group Cypher Functions
 * @category Math
 */
export function log(expr: Expr): CypherFunction {
    return new CypherFunction("log", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/mathematical-logarithmic/#functions-log10)
 * @group Cypher Functions
 * @category Math
 */
export function log10(expr: Expr): CypherFunction {
    return new CypherFunction("log10", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/mathematical-logarithmic/#functions-sqrt)
 * @group Cypher Functions
 * @category Math
 */
export function sqrt(expr: Expr): CypherFunction {
    return new CypherFunction("sqrt", [expr]);
}
