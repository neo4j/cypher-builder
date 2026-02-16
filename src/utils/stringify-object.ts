/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { escapeProperty } from "./escape";

/** Serializes object into a string for Cypher objects */
export function stringifyObject(fields: Record<string, string | undefined | null>): string {
    return `{ ${Object.entries(fields)
        .filter(([, value]) => Boolean(value))
        .map(([key, value]): string | undefined => {
            return `${escapeProperty(key)}: ${value}`;
        })
        .join(", ")} }`;
}
