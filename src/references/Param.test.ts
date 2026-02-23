/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../index.js";
import { TestClause } from "../utils/TestClause.js";

describe("Params", () => {
    test("Ignore unused parameters", () => {
        const param1 = new Cypher.Param(1999);

        const param2 = new Cypher.Param(2000); // Param created but not used by cypher builder

        const movieNode = new Cypher.Node();

        const query = new Cypher.Create(new Cypher.Pattern(movieNode)).set(
            [movieNode.property("released"), param1] // Explicitly defines the node property
        );

        const { params } = query.build();

        // Param 2 should exist for this test to be relevant
        expect(param2).toBeInstanceOf(Cypher.Param);
        expect(params).toMatchInlineSnapshot(`
            {
              "param0": 1999,
            }
        `);
    });

    test("Use named param twice", () => {
        const param1 = new Cypher.NamedParam("auth");
        const var1 = new Cypher.Variable();

        const clause1 = new TestClause(param1, var1);
        const var2 = new Cypher.Variable();
        const clause2 = new TestClause(param1, var2);
        const { cypher, params } = Cypher.utils.concat(clause1, clause2).build();

        expect(cypher).toMatchInlineSnapshot(`
            "$authvar0
            $authvar1"
        `);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Named param with value", () => {
        const param1 = new Cypher.NamedParam("auth", { test: "Hello" });

        const clause = new TestClause(param1);
        const { cypher, params } = clause.build();

        expect(cypher).toMatchInlineSnapshot(`"$auth"`);
        expect(params).toMatchInlineSnapshot(`
            {
              "auth": {
                "test": "Hello",
              },
            }
        `);
    });
});
