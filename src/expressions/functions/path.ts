/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { PathVariable } from "../../references/Path";
import { CypherFunction } from "./CypherFunctions";

/**
 * @see {@link https://neo4j.com/docs/cypher-cheat-sheet/current/#_path_functions | Cypher Documentation}
 * @group Functions
 * @category Path
 */
export function nodes(path: PathVariable): CypherFunction {
    return new CypherFunction("nodes", [path]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-cheat-sheet/current/#_path_functions | Cypher Documentation}
 * @group Functions
 * @category Path
 */
export function relationships(path: PathVariable): CypherFunction {
    return new CypherFunction("relationships", [path]);
}
