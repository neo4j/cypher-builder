/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../index.js";
import { TestClause } from "../../utils/TestClause.js";
import { OrderBy } from "./OrderBy.js";

describe("CypherBuilder OrderBy", () => {
    test("OrderBy with skip and limit", () => {
        const movieNode = new Cypher.Node();

        const orderBy = new OrderBy();
        orderBy.addOrderElements([
            [movieNode.property("name"), "DESC"],
            [movieNode.property("age"), "ASC"],
        ]);
        orderBy.skip(10);
        orderBy.limit(5);
        const testClause = new TestClause(orderBy);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "ORDER BY this0.name DESC, this0.age ASC
            SKIP 10
            LIMIT 5"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("OrderBy with skip and limit using params", () => {
        const movieNode = new Cypher.Node();

        const orderBy = new OrderBy();
        orderBy.addOrderElements([
            [movieNode.property("name"), "DESC"],
            [movieNode.property("age"), "ASC"],
        ]);
        orderBy.skip(new Cypher.Param(10));
        orderBy.limit(new Cypher.Param(5));
        const testClause = new TestClause(orderBy);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "ORDER BY this0.name DESC, this0.age ASC
            SKIP $param0
            LIMIT $param1"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 10,
              "param1": 5,
            }
        `);
    });

    test("OrderBy with skip and limit using expressions", () => {
        const movieNode = new Cypher.Node();

        const orderBy = new OrderBy();
        orderBy.addOrderElements([
            [movieNode.property("name"), "DESC"],
            [movieNode.property("age"), "ASC"],
        ]);

        orderBy.skip(Cypher.plus(new Cypher.Param(2), new Cypher.Param(2)));
        orderBy.limit(Cypher.plus(new Cypher.Param(10), new Cypher.Param(2)));
        const testClause = new TestClause(orderBy);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "ORDER BY this0.name DESC, this0.age ASC
            SKIP ($param0 + $param1)
            LIMIT ($param2 + $param3)"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 2,
              "param1": 2,
              "param2": 10,
              "param3": 2,
            }
        `);
    });
});
