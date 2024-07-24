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
import type { VoidCypherProcedure } from "../../procedures/CypherProcedure";
import { CypherProcedure } from "../../procedures/CypherProcedure";
import type { Expr } from "../../types";
import { normalizeExpr } from "../../utils/normalize-variable";

export * as cdc from "./cdc";
export * as index from "./index/dbIndex";
export * as schema from "./schema";

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

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_info)
 * @group Procedures
 */
export function info(): CypherProcedure<"id" | "creationDate"> {
    return new CypherProcedure("db.info");
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_createlabel)
 * @group Procedures
 */
export function createLabel(newLabel: Expr | string): VoidCypherProcedure {
    const newLabelExpr = normalizeExpr(newLabel);
    return new CypherProcedure("db.createLabel", [newLabelExpr]);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_createproperty)
 * @group Procedures
 */
export function createProperty(newProperty: Expr | string): VoidCypherProcedure {
    const newPropertyExpr = normalizeExpr(newProperty);
    return new CypherProcedure("db.createProperty", [newPropertyExpr]);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_createrelationshiptype)
 * @group Procedures
 */
export function createRelationshipType(newRelationshipType: Expr | string): VoidCypherProcedure {
    const newRelationshipTypeExpr = normalizeExpr(newRelationshipType);
    return new CypherProcedure("db.createRelationshipType", [newRelationshipTypeExpr]);
}
