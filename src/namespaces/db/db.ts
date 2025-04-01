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
import { CypherProcedure, VoidCypherProcedure } from "../../procedures/CypherProcedure";
import type { Expr } from "../../types";
import { normalizeExpr } from "../../utils/normalize-variable";

export * as cdc from "./cdc";
/**
 * @hideGroups
 */
export * as index from "./index/dbIndex";
export * as schema from "./schema";

const DB_NAMESPACE = "db";

// FUNCTIONS

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/cypher-manual/current/functions/database/#functions-database-nameFromElementId)
 * @group Functions
 */
export function nameFromElementId(dbName: Expr | string): CypherFunction {
    const dbNameExpr = normalizeExpr(dbName);
    return new CypherFunction("nameFromElementId", [dbNameExpr], DB_NAMESPACE);
}

// PROCEDURES

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_awaitindex)
 * @group Functions
 */
export function awaitIndex(indexName: Expr | string, timeOutSeconds: Expr | number): VoidCypherProcedure {
    const indexNameExpr = normalizeExpr(indexName);
    const timeOutSecondsExpr = normalizeExpr(timeOutSeconds);
    return new VoidCypherProcedure("awaitIndex", [indexNameExpr, timeOutSecondsExpr], DB_NAMESPACE);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_awaitindexes)
 * @group Functions
 */
export function awaitIndexes(timeOutSeconds: Expr | number): VoidCypherProcedure {
    const timeOutSecondsExpr = normalizeExpr(timeOutSeconds);
    return new VoidCypherProcedure("awaitIndex", [timeOutSecondsExpr], DB_NAMESPACE);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_createlabel)
 * @group Procedures
 */
export function createLabel(newLabel: Expr | string): VoidCypherProcedure {
    const newLabelExpr = normalizeExpr(newLabel);
    return new VoidCypherProcedure("createLabel", [newLabelExpr], DB_NAMESPACE);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_createproperty)
 * @group Procedures
 */
export function createProperty(newProperty: Expr | string): VoidCypherProcedure {
    const newPropertyExpr = normalizeExpr(newProperty);
    return new VoidCypherProcedure("createProperty", [newPropertyExpr], DB_NAMESPACE);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_createrelationshiptype)
 * @group Procedures
 */
export function createRelationshipType(newRelationshipType: Expr | string): VoidCypherProcedure {
    const newRelationshipTypeExpr = normalizeExpr(newRelationshipType);
    return new VoidCypherProcedure("createRelationshipType", [newRelationshipTypeExpr], DB_NAMESPACE);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_info)
 * @group Procedures
 */
export function info(): CypherProcedure<"id" | "creationDate"> {
    return new CypherProcedure("info", [], DB_NAMESPACE);
}

/** Returns all labels in the database
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/5/reference/procedures/#procedure_db_labels)
 * @group Procedures
 */
export function labels(): CypherProcedure<"label"> {
    return new CypherProcedure("labels", [], DB_NAMESPACE);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_ping)
 * @group Procedures
 */
export function ping(): CypherProcedure<"success"> {
    return new CypherProcedure("ping", [], DB_NAMESPACE);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_propertykeys)
 * @group Procedures
 */
export function propertyKeys(): CypherProcedure<"propertyKey"> {
    return new CypherProcedure("propertyKeys", [], DB_NAMESPACE);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_relationshiptypes)
 * @group Procedures
 */
export function relationshipTypes(): CypherProcedure<"relationshipType"> {
    return new CypherProcedure("relationshipTypes", [], DB_NAMESPACE);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_resampleindex)
 * @group Procedures
 */
export function resampleIndex(): CypherProcedure<"indexName"> {
    return new CypherProcedure("resampleIndex", [], DB_NAMESPACE);
}
/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_resampleoutdatedindexes)
 * @group Procedures
 */
export function resampleOutdatedIndexes(): VoidCypherProcedure {
    return new CypherProcedure("resampleOutdatedIndexes", [], DB_NAMESPACE);
}
