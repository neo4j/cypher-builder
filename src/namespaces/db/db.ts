/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherFunction } from "../../expressions/functions/CypherFunctions.js";
import { CypherProcedure, VoidCypherProcedure } from "../../procedures/CypherProcedure.js";
import type { Expr } from "../../types.js";
import { normalizeExpr } from "../../utils/normalize-variable.js";

export * as cdc from "./cdc.js";
/**
 * @hideGroups
 */
export * as index from "./index/dbIndex.js";
export * as schema from "./schema.js";

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
