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
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-datetime)
 * @group Cypher Functions
 * @category Temporal
 */
export function cypherDatetime(timezone?: Expr): CypherFunction {
    return dateFunction("datetime", timezone);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-date)
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
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localdatetime)
 * @group Cypher Functions
 * @category Temporal
 */
export function cypherLocalDatetime(timezone?: Expr): CypherFunction {
    return dateFunction("localdatetime", timezone);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localdatetime)
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-localdatetime)
 * @group Cypher Functions
 * @category Temporal
 */
export function cypherLocalTime(timezone?: Expr): CypherFunction {
    return dateFunction("localtime", timezone);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/#functions-time)
 * @group Cypher Functions
 * @category Temporal
 */

export function cypherTime(timezone?: Expr): CypherFunction {
    return dateFunction("time", timezone);
}

function dateFunction(name: string, timezone?: Expr): CypherFunction {
    return new CypherFunction(name, timezone ? [timezone] : undefined);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/duration)
 * @group Cypher Functions
 * @category Temporal
 */
export function duration(components: Expr): CypherFunction {
    return new CypherFunction("duration", [components]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/duration/#functions-duration-between)
 * @group Cypher Functions
 * @category Temporal
 */
duration.between = (instant1: Expr, instant2: Expr): CypherFunction => {
    return new CypherFunction("duration.between", [instant1, instant2]);
};

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/duration/#functions-duration-inmonths)
 * @group Cypher Functions
 * @category Temporal
 */
duration.inMonths = (instant1: Expr, instant2: Expr): CypherFunction => {
    return new CypherFunction("duration.inMonths", [instant1, instant2]);
};

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/duration/#functions-duration-indays)
 * @group Cypher Functions
 * @category Temporal
 */
duration.inDays = (instant1: Expr, instant2: Expr): CypherFunction => {
    return new CypherFunction("duration.inDays", [instant1, instant2]);
};

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/temporal/duration/#functions-duration-inseconds)
 * @group Cypher Functions
 * @category Temporal
 */
duration.inSeconds = (instant1: Expr, instant2: Expr): CypherFunction => {
    return new CypherFunction("duration.inSeconds", [instant1, instant2]);
};
