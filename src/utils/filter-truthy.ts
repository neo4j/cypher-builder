/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

/** Filter all elements in an array, only leaving truthy values */
export function filterTruthy<T>(arr: Array<T | null | undefined>): Array<T> {
    return arr.filter((v): v is T => !!v);
}
