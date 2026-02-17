/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "..";
import { TestClause } from "../utils/TestClause";

describe("Literal", () => {
    test("Serialize string value", () => {
        const stringLiteral = new Cypher.Literal("hello");

        const testClause = new TestClause(stringLiteral);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`"hello"`);
    });

    test("Serialize string value escaping it", () => {
        const stringLiteral = new Cypher.Literal(`he"llo`);

        const testClause = new TestClause(stringLiteral);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`"he\\"llo"`);
    });

    test("Serialize boolean value", () => {
        const booleanLiteral = new Cypher.Literal(true);

        const testClause = new TestClause(booleanLiteral);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`true`);
    });

    test("Serialize number value", () => {
        const numberLiteral = new Cypher.Literal(5);

        const testClause = new TestClause(numberLiteral);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`5`);
    });

    test("Serialize array", () => {
        const literal = new Cypher.Literal(["hello", 5, "hello"]);

        const testClause = new TestClause(literal);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`["hello", 5, "hello"]`);
    });

    test("Serialize array escaping values", () => {
        const literal = new Cypher.Literal(["hello", 5, 'hel""lo']);

        const testClause = new TestClause(literal);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`["hello", 5, "hel\\"\\"lo"]`);
    });

    test("Serialize null", () => {
        const literal = new Cypher.Literal(null);

        const testClause = new TestClause(literal);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`NULL`);
    });

    test("Null constant literal", () => {
        const testClause = new TestClause(Cypher.Null);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`NULL`);
    });

    test("True constant literal", () => {
        const testClause = new TestClause(Cypher.true);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`true`);
    });

    test("False constant literal", () => {
        const testClause = new TestClause(Cypher.false);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`false`);
    });
});
