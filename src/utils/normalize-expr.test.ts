/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../index";
import { normalizeExpr } from "./normalize-expr";

describe("normalizeExpr", () => {
    test("returns the same variable if it is a CypherCompilable", () => {
        const originalVariable = new Cypher.Literal("hello");
        const result = normalizeExpr(originalVariable);

        expect(result).toEqual(originalVariable);
    });

    test("generates a new literal variable if it is a primitive value", () => {
        const result = normalizeExpr(5);

        expect(result).toBeInstanceOf(Cypher.Literal);
    });
});
