/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherFunction } from "./CypherFunctions.js";

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/load-csv/#_access_line_numbers_with_linenumber | Cypher Documentation}
 * @group Functions
 */
export function linenumber(): CypherFunction {
    return new CypherFunction("linenumber");
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/load-csv/#_access_the_csv_file_path_with_file | Cypher Documentation}
 * @group Functions
 */
export function file(): CypherFunction {
    return new CypherFunction("file");
}
