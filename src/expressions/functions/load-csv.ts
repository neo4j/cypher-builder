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

import { CypherFunction } from "./CypherFunctions";

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
