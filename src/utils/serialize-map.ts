/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment.js";
import type { Expr } from "../types.js";
import { escapeProperty } from "./escape.js";

export function serializeMap(env: CypherEnvironment, map: Map<string, Expr>, omitCurlyBraces = false): string {
    const serializedFields: string[] = [];

    for (const [key, value] of map.entries()) {
        if (value) {
            const fieldStr = `${escapeProperty(key)}: ${value.getCypher(env)}`;
            serializedFields.push(fieldStr);
        }
    }

    const serializedContent = serializedFields.join(", ");
    if (omitCurlyBraces) return serializedContent;
    return `{${serializedContent}}`;
}
