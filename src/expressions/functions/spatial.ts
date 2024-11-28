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
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/spatial/ | Cypher Documentation}
 * @group Cypher Functions
 * @category Spatial
 */
export function point(variable: Expr): CypherFunction {
    return new CypherFunction("point", [variable]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/4.3/functions/spatial/#functions-distance | Cypher Documentation}
 * @group Cypher Functions
 * @category Spatial
 * @deprecated No longer supported in Neo4j 5. Use {@link point.distance} instead.
 */
export function distance(lexpr: Expr, rexpr: Expr): CypherFunction {
    return new CypherFunction("distance", [lexpr, rexpr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/spatial/#functions-distance | Cypher Documentation}
 * @group Cypher Functions
 * @category Spatial
 * @example Generated Cypher: `point.distance(point1, point2)`
 */
point.distance = (lexpr: Expr, rexpr: Expr): CypherFunction => {
    return new CypherFunction("point.distance", [lexpr, rexpr]);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/spatial/#functions-withinBBox | Cypher Documentation}
 * @group Cypher Functions
 * @category Spatial
 */
point.withinBBox = (point: Expr, lexpr: Expr, rexpr: Expr): CypherFunction => {
    return new CypherFunction("point.withinBBox", [point, lexpr, rexpr]);
};
