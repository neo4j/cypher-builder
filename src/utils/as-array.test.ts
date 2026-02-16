/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { asArray } from "./as-array";

describe("asArray", () => {
    test("get array from array", () => {
        const result = asArray([1, 2]);
        expect(result).toEqual([1, 2]);
    });

    test("get array from null", () => {
        const result = asArray(null);
        expect(result).toEqual([]);
    });

    test("get array from undefined", () => {
        const result = asArray(undefined);
        expect(result).toEqual([]);
    });

    test("get array from object", () => {
        const result = asArray({});
        expect(result).toEqual([{}]);
    });

    test("get array from number", () => {
        const result = asArray(3);
        expect(result).toEqual([3]);
    });
});
