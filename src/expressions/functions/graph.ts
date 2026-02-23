/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Expr } from "../../types.js";
import { CypherFunction } from "./CypherFunctions.js";

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/graph/#functions-graph-names | Cypher Documentation}
 * @group Functions
 */
export function names(): CypherFunction {
    return new CypherFunction("graph.names");
}
/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/graph/#functions-graph-propertiesByName | Cypher Documentation}
 * @group Functions
 */
export function propertiesByName(name: Expr): CypherFunction {
    return new CypherFunction("graph.propertiesByName", [name]);
}
/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/graph/#functions-graph-byname | Cypher Documentation}
 * @group Functions
 */
export function byName(graphName: Expr): CypherFunction {
    return new CypherFunction("graph.propertiesByName", [graphName]);
}
