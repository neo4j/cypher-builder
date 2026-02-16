/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "..";
import { TestClause } from "../utils/TestClause";

describe("Property", () => {
    test("Serialize string property", () => {
        const variable = new Cypher.Variable();
        const property = variable.property("myProperty");

        const testClause = new TestClause(property);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"var0.myProperty"`);
    });

    test("Create property ref directly", () => {
        const variable = new Cypher.Variable();
        const property = new Cypher.Property(variable, "myProperty");

        const testClause = new TestClause(property);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"var0.myProperty"`);
    });

    test("Create nested property ref directly", () => {
        const variable = new Cypher.Variable();
        const property = new Cypher.Property(variable, "myProperty", "nested");

        const testClause = new TestClause(property);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"var0.myProperty.nested"`);
    });

    test("Escape string property if needed", () => {
        const variable = new Cypher.Variable();
        const property = variable.property("myPro`perty");

        const testClause = new TestClause(property);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"var0.\`myPro\`\`perty\`"`);
    });

    test("Serialize nested string property", () => {
        const variable = new Cypher.Variable();
        const property = variable.property("myProperty").property("myNestedValue");

        const testClause = new TestClause(property);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"var0.myProperty.myNestedValue"`);
    });

    test("Nested properties should not modify parent prop", () => {
        const variable = new Cypher.Variable();
        const property = variable.property("myProperty");
        const nestedProp = property.property("myNestedValue");

        const testClause1 = new TestClause(property);
        const testClause2 = new TestClause(nestedProp);

        const queryResult = testClause1.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"var0.myProperty"`);

        const queryResult2 = testClause2.build();
        expect(queryResult2.cypher).toMatchInlineSnapshot(`"var0.myProperty.myNestedValue"`);
    });

    test("List index access on property", () => {
        const variable = new Cypher.Variable();
        const property = variable.property("myProperty").index(5);

        const testClause = new TestClause(property);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"var0.myProperty[5]"`);
    });

    test("List range access on property", () => {
        const variable = new Cypher.Variable();
        const property = variable.property("myProperty").range(1, -1);

        const testClause = new TestClause(property);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"var0.myProperty[1..-1]"`);
    });

    describe("Expression", () => {
        test("Serialize expression with []", () => {
            const variable = new Cypher.Variable();

            const expr = Cypher.date();
            const property = variable.property(expr);

            const testClause = new TestClause(property);

            const queryResult = testClause.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"var0[date()]"`);
        });

        test("Serialize nested expression with []", () => {
            const variable = new Cypher.Variable();

            const expr = Cypher.date();
            const expr2 = new Cypher.Literal("Hello");
            const property = variable.property(expr).property(expr2);

            const testClause = new TestClause(property);

            const queryResult = testClause.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"var0[date()][\\"Hello\\"]"`);
        });

        test("Serialize nested string after expression", () => {
            const variable = new Cypher.Variable();

            const expr = Cypher.date();
            const property = variable.property(expr);

            const testClause = new TestClause(property);

            const queryResult = testClause.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"var0[date()]"`);
        });

        test("Serialize nested expression after string expression", () => {
            const variable = new Cypher.Variable();

            const expr = Cypher.date();
            const property = variable.property(expr);

            const testClause = new TestClause(property);

            const queryResult = testClause.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"var0[date()]"`);
        });

        test("List index access on property after expression", () => {
            const variable = new Cypher.Variable();

            const expr = Cypher.date();
            const property = variable.property(expr).index(2);

            const testClause = new TestClause(property);

            const queryResult = testClause.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"var0[date()][2]"`);
        });
    });
});
