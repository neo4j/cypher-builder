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

import { CypherFunction } from "../../expressions/functions/CypherFunctions";
import { CypherProcedure } from "../../procedures/CypherProcedure";
import type { Expr } from "../../types";
import { normalizeExpr } from "../../utils/normalize-variable";

export * as cdc from "./cdc";
export * as index from "./dbIndex";

/** Returns all labels in the database
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/5/reference/procedures/#procedure_db_labels)
 * @group Procedures
 */
export function labels(): CypherProcedure<"label"> {
    return new CypherProcedure("db.labels");
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/cypher-manual/current/functions/database/#functions-database-nameFromElementId)
 * @group Functions
 */
export function nameFromElementId(dbName: Expr | string): CypherFunction {
    const dbNameExpr = normalizeExpr(dbName);
    return new CypherFunction("db.nameFromElementId", [dbNameExpr]);
}
