/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Expr } from "../../types";
import { CypherFunction } from "./CypherFunctions";

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/spatial/ | Cypher Documentation}
 * @group Functions
 * @category Spatial
 */
export function point(variable: Expr): CypherFunction {
    return new CypherFunction("point", [variable]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/spatial/#functions-distance | Cypher Documentation}
 * @group Functions
 * @category Spatial
 * @example Generated Cypher: `point.distance(point1, point2)`
 */
point.distance = (lexpr: Expr, rexpr: Expr): CypherFunction => {
    return new CypherFunction("point.distance", [lexpr, rexpr]);
};

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/spatial/#functions-withinBBox | Cypher Documentation}
 * @group Functions
 * @category Spatial
 */
point.withinBBox = (point: Expr, lexpr: Expr, rexpr: Expr): CypherFunction => {
    return new CypherFunction("point.withinBBox", [point, lexpr, rexpr]);
};
