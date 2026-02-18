/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "..";
import { normalizeVariable } from "./normalize-variable";

describe("normalizeVariable", () => {
    test("returns the same variable if it is a CypherCompilable", () => {
        const originalVariable = new Cypher.Literal("hello");
        const result = normalizeVariable(originalVariable);

        expect(result).toEqual(originalVariable);
    });

    test("generates a new literal variable if it is a primitive value", () => {
        const result = normalizeVariable(5);

        expect(result).toBeInstanceOf(Cypher.Literal);
    });
});
