/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment";
import type { CypherCompilable } from "../types";

/** Compiles the cypher of an element, if the resulting cypher is not empty adds a prefix */
export function compileCypherIfExists(
    element: CypherCompilable | undefined,
    env: CypherEnvironment,
    { prefix = "", suffix = "" }: { prefix?: string; suffix?: string } = {}
): string {
    if (!element) return "";
    const cypher = element.getCypher(env);
    if (!cypher) return "";
    return `${prefix}${cypher}${suffix}`;
}
