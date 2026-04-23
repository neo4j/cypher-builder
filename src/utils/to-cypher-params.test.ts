/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { Param } from "../references/Param";
import { toCypherParams } from "./to-cypher-params";

describe("toCypherParams", () => {
    test("wraps each value in a Param preserving keys", () => {
        const result = toCypherParams({ a: 1, b: "two" });

        expect(result.a).toBeInstanceOf(Param);
        expect(result.b).toBeInstanceOf(Param);
    });

    test("empty object", () => {
        expect(toCypherParams({})).toEqual({});
    });
});
