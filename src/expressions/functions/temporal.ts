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

import { Literal } from "../../references/Literal";
import type { Expr } from "../../types";
import { normalizeExpr } from "../../utils/normalize-variable";
import { CypherFunction } from "./CypherFunctions";

/** Temporal unit to be used in `.truncate()` functions
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-date-truncate | Cypher Documentation}
 */
export type TemporalUnit =
    | "millennium"
    | "century"
    | "decade"
    | "year"
    | "weekYear"
    | "quarter"
    | "month"
    | "week"
    | "day";

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-datetime | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
export function cypherDatetime(timezone?: Expr): CypherFunction {
    return dateFunction("datetime", timezone);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-datetime-timestamp | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherDatetime.fromepoch = (seconds: number | Expr, nanoseconds: number | Expr): CypherFunction => {
    const secondsExpr = normalizeExpr(seconds);
    const nanosecondsExpr = normalizeExpr(nanoseconds);
    return new CypherFunction("datetime.fromepoch", [secondsExpr, nanosecondsExpr]);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-datetime-timestamp | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherDatetime.fromepochmilis = (seconds: number | Expr, nanoseconds: number | Expr): CypherFunction => {
    const secondsExpr = normalizeExpr(seconds);
    const nanosecondsExpr = normalizeExpr(nanoseconds);
    return new CypherFunction("datetime.fromepochmilis", [secondsExpr, nanosecondsExpr]);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-datetime-realtime | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherDatetime.realtime = (timezone?: Expr): CypherFunction => {
    return dateFunction("datetime.realtime", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-datetime-statement | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherDatetime.statement = (timezone?: Expr): CypherFunction => {
    return dateFunction("datetime.statement", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-datetime-transaction | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherDatetime.transaction = (timezone?: Expr): CypherFunction => {
    return dateFunction("datetime.transaction", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-datetime-truncate | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherDatetime.truncate = (
    unit: TemporalUnit,
    temporalInstantValue: Expr,
    mapOfComponentsTimezone?: Expr
): CypherFunction => {
    const unitLiteral = new Literal(unit);

    const params = [unitLiteral, temporalInstantValue];
    if (mapOfComponentsTimezone) params.push(mapOfComponentsTimezone);

    return new CypherFunction("datetime.truncate", params);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-date | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 * @example
 *
 * Date without parameters:
 *
 * ```ts
 * Cypher.date()
 * ```
 *
 * _Cypher:_
 * ```cypher
 * date()
 * ```
 *
 * @example
 * Date with parameters:
 *
 * ```ts
 * Cypher.date(new Cypher.param('9999-01-01'))
 * ```
 *
 * _Cypher:_
 * ```cypher
 * date($param1)
 * ```
 */
export function cypherDate(timezone?: Expr): CypherFunction {
    return dateFunction("date", timezone);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-date-realtime | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherDate.realtime = (timezone?: Expr): CypherFunction => {
    return dateFunction("date.realtime", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-date-statement | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherDate.statement = (timezone?: Expr): CypherFunction => {
    return dateFunction("date.statement", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-date-transaction | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherDate.transaction = (timezone?: Expr): CypherFunction => {
    return dateFunction("date.transaction", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-date-truncate | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherDate.truncate = (
    unit: TemporalUnit,
    temporalInstantValue: Expr,
    mapOfComponentsTimezone?: Expr
): CypherFunction => {
    const unitLiteral = new Literal(unit);

    const params = [unitLiteral, temporalInstantValue];
    if (mapOfComponentsTimezone) params.push(mapOfComponentsTimezone);

    return new CypherFunction("date.truncate", params);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localdatetime | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
export function cypherLocalDatetime(timezone?: Expr): CypherFunction {
    return dateFunction("localdatetime", timezone);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localdatetime-realtime | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherLocalDatetime.realtime = (timezone?: Expr): CypherFunction => {
    return dateFunction("localdatetime.realtime", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localdatetime-statement | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherLocalDatetime.statement = (timezone?: Expr): CypherFunction => {
    return dateFunction("localdatetime.statement", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localdatetime-transaction | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherLocalDatetime.transaction = (timezone?: Expr): CypherFunction => {
    return dateFunction("localdatetime.transaction", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localdatetime-truncate | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherLocalDatetime.truncate = (
    unit: TemporalUnit,
    temporalInstantValue: Expr,
    mapOfComponentsTimezone?: Expr
): CypherFunction => {
    const unitLiteral = new Literal(unit);

    const params = [unitLiteral, temporalInstantValue];
    if (mapOfComponentsTimezone) params.push(mapOfComponentsTimezone);

    return new CypherFunction("localdatetime.truncate", params);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localtime | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
export function cypherLocalTime(timezone?: Expr): CypherFunction {
    return dateFunction("localtime", timezone);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localtime-realtime | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherLocalTime.realtime = (timezone?: Expr): CypherFunction => {
    return dateFunction("localtime.realtime", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localtime-statement | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherLocalTime.statement = (timezone?: Expr): CypherFunction => {
    return dateFunction("localtime.statement", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localtime-transaction | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherLocalTime.transaction = (timezone?: Expr): CypherFunction => {
    return dateFunction("localtime.transaction", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localtime-truncate | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherLocalTime.truncate = (
    unit: TemporalUnit,
    temporalInstantValue: Expr,
    mapOfComponentsTimezone?: Expr
): CypherFunction => {
    const unitLiteral = new Literal(unit);

    const params = [unitLiteral, temporalInstantValue];
    if (mapOfComponentsTimezone) params.push(mapOfComponentsTimezone);

    return new CypherFunction("localtime.truncate", params);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-time | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */

export function cypherTime(timezone?: Expr): CypherFunction {
    return dateFunction("time", timezone);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-time-realtime | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherTime.realtime = (timezone?: Expr): CypherFunction => {
    return dateFunction("time.realtime", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-time-statement | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherTime.statement = (timezone?: Expr): CypherFunction => {
    return dateFunction("time.statement", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-time-transaction | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherTime.transaction = (timezone?: Expr): CypherFunction => {
    return dateFunction("time.transaction", timezone);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-time-truncate | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
cypherTime.truncate = (
    unit: TemporalUnit,
    temporalInstantValue: Expr,
    mapOfComponentsTimezone?: Expr
): CypherFunction => {
    const unitLiteral = new Literal(unit);

    const params = [unitLiteral, temporalInstantValue];
    if (mapOfComponentsTimezone) params.push(mapOfComponentsTimezone);

    return new CypherFunction("time.truncate", params);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/duration | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
export function duration(components: Expr): CypherFunction {
    return new CypherFunction("duration", [components]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/duration/#functions-duration-between | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
duration.between = (instant1: Expr, instant2: Expr): CypherFunction => {
    return new CypherFunction("duration.between", [instant1, instant2]);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/duration/#functions-duration-inmonths | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
duration.inMonths = (instant1: Expr, instant2: Expr): CypherFunction => {
    return new CypherFunction("duration.inMonths", [instant1, instant2]);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/duration/#functions-duration-indays | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
duration.inDays = (instant1: Expr, instant2: Expr): CypherFunction => {
    return new CypherFunction("duration.inDays", [instant1, instant2]);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/temporal/duration/#functions-duration-inseconds | Cypher Documentation}
 * @group Cypher Functions
 * @category Temporal
 */
duration.inSeconds = (instant1: Expr, instant2: Expr): CypherFunction => {
    return new CypherFunction("duration.inSeconds", [instant1, instant2]);
};

// Handles optional timezone param before creating a function
function dateFunction(name: string, timezone?: Expr): CypherFunction {
    return new CypherFunction(name, timezone ? [timezone] : undefined);
}
