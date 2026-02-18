/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../index.js";
import { TestClause } from "../../utils/TestClause.js";

describe("Math Functions", () => {
    // Functions with no argument
    test.each(["rand", "e", "pi"] as const)("%s()", (value) => {
        const mathFunc = Cypher[value]();
        const { cypher } = new TestClause(mathFunc).build();

        expect(cypher).toBe(`${value}()`);
    });
    // Functions with 1 argument
    test.each([
        "abs",
        "ceil",
        "floor",
        "isNaN",
        "sign",
        "exp",
        "log",
        "log10",
        "sqrt",
        "acos",
        "asin",
        "atan",
        "atan2",
        "cos",
        "cot",
        "degrees",
        "haversin",
        "radians",
        "sin",
        "tan",
    ] as const)("%s()", (value) => {
        const mathFunc = Cypher[value](new Cypher.Literal(10));
        const { cypher } = new TestClause(mathFunc).build();

        expect(cypher).toBe(`${value}(10)`);
    });

    describe("round()", () => {
        const roundNumber = new Cypher.Literal(10.23);

        test("round() with a single expression", () => {
            const roundFunc = Cypher.round(roundNumber);
            const { cypher } = new TestClause(roundFunc).build();

            expect(cypher).toBe(`round(10.23)`);
        });

        test("round() with precision number", () => {
            const roundFunc = Cypher.round(roundNumber, 4);
            const { cypher } = new TestClause(roundFunc).build();

            expect(cypher).toBe(`round(10.23, 4)`);
        });

        test("round() with precision expression", () => {
            const roundFunc = Cypher.round(roundNumber, new Cypher.Literal(3));
            const { cypher } = new TestClause(roundFunc).build();

            expect(cypher).toBe(`round(10.23, 3)`);
        });

        test("round() with precision mode", () => {
            const roundFunc = Cypher.round(roundNumber, 3, "HALF_DOWN");
            const { cypher } = new TestClause(roundFunc).build();

            expect(cypher).toBe(`round(10.23, 3, 'HALF_DOWN')`);
        });
    });
});
