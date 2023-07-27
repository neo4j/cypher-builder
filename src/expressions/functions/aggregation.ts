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
import type { Expr } from "../../types";
import { normalizeExpr } from "../../utils/normalize-variable";
import { CypherFunction } from "./CypherFunctions";

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-count)
 * @group Cypher Functions
 * @category Aggregations
 */
export function count(expr: Expr | "*"): CypherAggregationFunction {
    return new CypherAggregationFunction("count", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-min)
 * @group Cypher Functions
 * @category Aggregations
 */
export function min(expr: Expr): CypherAggregationFunction {
    return new CypherAggregationFunction("min", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-max)
 * @group Cypher Functions
 * @category Aggregations
 */
export function max(expr: Expr): CypherAggregationFunction {
    return new CypherAggregationFunction("max", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-avg)
 * @group Cypher Functions
 * @category Aggregations
 */
export function avg(expr: Expr): CypherAggregationFunction {
    return new CypherAggregationFunction("avg", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-sum)
 * @group Cypher Functions
 * @category Aggregations
 */
export function sum(expr: Expr): CypherAggregationFunction {
    return new CypherAggregationFunction("sum", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-collect)
 * @group Cypher Functions
 * @category Aggregations
 */
export function collect(expr: Expr): CypherAggregationFunction {
    return new CypherAggregationFunction("collect", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-percentilecont)
 * @group Cypher Functions
 * @category Aggregations
 */
export function percentileCont(expr: Expr, percentile: number | Expr): CypherAggregationFunction {
    const normalizedPercentile = normalizeExpr(percentile);
    return new CypherAggregationFunction("percentileCont", [expr, normalizedPercentile]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-percentiledisc)
 * @group Cypher Functions
 * @category Aggregations
 */
export function percentileDisc(expr: Expr, percentile: number | Expr): CypherAggregationFunction {
    const normalizedPercentile = normalizeExpr(percentile);
    return new CypherAggregationFunction("percentileDisc", [expr, normalizedPercentile]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-stdev)
 * @group Cypher Functions
 * @category Aggregations
 */
export function stDev(expr: Expr): CypherAggregationFunction {
    return new CypherAggregationFunction("stDev", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-stdevp)
 * @group Cypher Functions
 * @category Aggregations
 */
export function stDevP(expr: Expr): CypherAggregationFunction {
    return new CypherAggregationFunction("stDevP", [expr]);
}

/** Represents a Cypher Aggregation function
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating)
 * @group Cypher Functions
 * @category Aggregations
 */
export class CypherAggregationFunction extends CypherFunction {
    private hasDistinct = false;
    private hasStar = false;

    /**
     * @internal
     */
    constructor(name: string, params: Array<Expr | "*">) {
        super(name);

        for (const param of params) {
            if (param === "*") {
                this.hasStar = true;
            } else {
                this.addParam(param);
            }
        }
    }

    /**
     * Adds DISTINCT to remove duplicates on the aggregation functions
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#_counting_with_and_without_duplicates)
     */
    public distinct(): this {
        if (this.hasStar) {
            throw new Error("count(*) is not supported with DISTINCT");
        }
        this.hasDistinct = true;
        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const argsStr = this.hasStar ? "*" : this.serializeParams(env);
        const distinctStr = this.hasDistinct ? "DISTINCT " : "";

        return `${this.name}(${distinctStr}${argsStr})`;
    }
}
