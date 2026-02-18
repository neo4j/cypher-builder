/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";
import { TestClause } from "../../utils/TestClause";

describe("List comprehension", () => {
    test("comprehension without filter", () => {
        const variable = new Cypher.Variable();
        const exprVariable = new Cypher.Param([1, 2, 5]);

        const listComprehension = new Cypher.ListComprehension(variable).in(exprVariable);

        const queryResult = new TestClause(listComprehension).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"[var0 IN $param0]"`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": [
                1,
                2,
                5,
              ],
            }
        `);
    });

    test("comprehension with filter", () => {
        const variable = new Cypher.Variable();
        const exprVariable = new Cypher.Param([1, 2, 5]);
        const andExpr = Cypher.eq(variable, new Cypher.Param(5));

        const listComprehension = new Cypher.ListComprehension(variable).in(exprVariable).where(andExpr);

        const queryResult = new TestClause(listComprehension).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"[var0 IN $param1 WHERE var0 = $param0]"`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 5,
              "param1": [
                1,
                2,
                5,
              ],
            }
        `);
    });

    test("comprehension with expression and map using building methods", () => {
        const variable = new Cypher.Variable();
        const exprVariable = new Cypher.Param([1, 2, 5]);
        const andExpr = Cypher.eq(variable, new Cypher.Param(5));

        const listComprehension = new Cypher.ListComprehension(variable)
            .in(exprVariable)
            .where(andExpr)
            .map(Cypher.plus(variable, new Cypher.Literal(1)));

        const queryResult = new TestClause(listComprehension).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"[var0 IN $param1 WHERE var0 = $param0 | (var0 + 1)]"`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 5,
              "param1": [
                1,
                2,
                5,
              ],
            }
        `);
    });

    test("Overrides if a expression is set twice", () => {
        const variable = new Cypher.Variable();
        const exprVariable = new Cypher.Param([1, 2, 5]);
        const exprVariable2 = new Cypher.Param([1, 3]);

        const listComprehension = new Cypher.ListComprehension(variable).in(exprVariable).in(exprVariable2);

        const queryResult = new TestClause(listComprehension).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"[var0 IN $param0]"`);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": [
                1,
                3,
              ],
            }
        `);
    });

    test("Fails to build if no expression is set", () => {
        const variable = new Cypher.Variable();

        const listComprehension = new Cypher.ListComprehension(variable);
        expect(() => {
            new TestClause(listComprehension).build();
        }).toThrow("List Comprehension needs a source list after IN");
    });
});
