/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { filterTruthy } from "./filter-truthy";

describe("filterTruthy", () => {
    test("removes null and undefined", () => {
        expect(filterTruthy([1, null, 2, undefined, 3])).toEqual([1, 2, 3]);
    });

    test("removes falsy primitives", () => {
        expect(filterTruthy([0, "", false, NaN, "ok"])).toEqual(["ok"]);
    });

    test("empty array", () => {
        expect(filterTruthy([])).toEqual([]);
    });

    test("keeps objects including empty object", () => {
        const o = {};
        expect(filterTruthy([o, null])).toEqual([o]);
    });
});
