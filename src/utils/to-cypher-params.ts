/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { Param } from "../references/Param.js";

/** Converts an object into an object of Param so it can easily be passed to a pattern. */
export function toCypherParams<T>(original: Record<string, T>): Record<string, Param<T>> {
    return Object.entries(original).reduce<Record<string, Param<T>>>((acc, [key, value]) => {
        acc[key] = new Param(value);
        return acc;
    }, {});
}
