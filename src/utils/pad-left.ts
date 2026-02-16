/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

/** Adds spaces to the left of the string, returns empty string if variable is undefined or empty string */
export function padLeft(str: string | undefined): string {
    if (!str) return "";
    return ` ${str}`;
}
