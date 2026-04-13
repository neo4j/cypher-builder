/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherCompilable } from "../types";

export function isCypherCompilable(value: unknown): value is CypherCompilable {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    return Boolean(typeof (value as any)?.getCypher === "function");
}
