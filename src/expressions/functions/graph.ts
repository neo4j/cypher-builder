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
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/graph/#functions-graph-names | Cypher Documentation}
 * @group Cypher Functions
 * @category Graph
 */
export function names(): CypherFunction {
    return new CypherFunction("graph.names");
}
/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/graph/#functions-graph-propertiesByName | Cypher Documentation}
 * @group Cypher Functions
 * @category Graph
 */
export function propertiesByName(name: Expr): CypherFunction {
    return new CypherFunction("graph.propertiesByName", [name]);
}
/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/graph/#functions-graph-byname | Cypher Documentation}
 * @group Cypher Functions
 * @category Graph
 */
export function byName(graphName: Expr): CypherFunction {
    return new CypherFunction("graph.propertiesByName", [graphName]);
}
