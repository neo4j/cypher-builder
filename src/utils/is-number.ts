/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

/** Check if something is a number */
export function isNumber(n: unknown): n is number {
    return typeof n === "number" && !Number.isNaN(n);
}
