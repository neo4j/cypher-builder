/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

/** Checks if value is string */
export function isString(value: unknown): value is string {
    return typeof value === "string";
}
