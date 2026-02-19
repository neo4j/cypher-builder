/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../index.js";

describe("CypherBuilder Return", () => {
    test("Return columns", () => {
        const node = new Cypher.Node();
        const returnQuery = new Cypher.Return(node, new Cypher.Literal(10));

        const queryResult = returnQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"RETURN this0, 10"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Return *", () => {
        const returnQuery = new Cypher.Return("*");

        const queryResult = returnQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"RETURN *"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Return variable", () => {
        const returnQuery = new Cypher.Return(new Cypher.Variable());

        const queryResult = returnQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"RETURN var0"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Return named variable", () => {
        const returnQuery = new Cypher.Return(new Cypher.NamedVariable("result"));

        const queryResult = returnQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"RETURN result"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Alias with a variable", () => {
        const node = new Cypher.Node();
        const returnQuery = new Cypher.Return([node, new Cypher.Variable()]);

        const queryResult = returnQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"RETURN this0 AS var1"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Using addColumns", () => {
        const node = new Cypher.Node();
        const returnQuery = new Cypher.Return(node).addColumns(new Cypher.Literal(10), new Cypher.Literal(11));

        const queryResult = returnQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"RETURN this0, 10, 11"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    describe("With order", () => {
        test("Return with order", () => {
            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Return(movieNode).orderBy([movieNode.property("age"), "DESC"]);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "RETURN this0
                ORDER BY this0.age DESC"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Return with order with default sorting order", () => {
            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Return(movieNode).orderBy(movieNode.property("age"));

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "RETURN this0
                ORDER BY this0.age ASC"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Return with order and skip", () => {
            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Return(movieNode).orderBy([movieNode.property("age")]).skip(10);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "RETURN this0
                ORDER BY this0.age ASC
                SKIP 10"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Return with order and skip param", () => {
            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Return(movieNode)
                .orderBy([movieNode.property("age")])
                .skip(new Cypher.Param(10));

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "RETURN this0
                ORDER BY this0.age ASC
                SKIP $param0"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": 10,
                }
            `);
        });

        test("Return with order and offset param", () => {
            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Return(movieNode)
                .orderBy([movieNode.property("age")])
                .offset(new Cypher.Param(10));

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "RETURN this0
                ORDER BY this0.age ASC
                OFFSET $param0"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": 10,
                }
            `);
        });

        test("Return with order and limit", () => {
            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Return(movieNode).orderBy([movieNode.property("age")]).limit(5);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "RETURN this0
                ORDER BY this0.age ASC
                LIMIT 5"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Return with order and limit param", () => {
            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Return(movieNode)
                .orderBy([movieNode.property("age")])
                .limit(new Cypher.Param(5));

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "RETURN this0
                ORDER BY this0.age ASC
                LIMIT $param0"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": 5,
                }
            `);
        });

        test("Return with skip and limit expressions and no order", () => {
            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Return(movieNode)
                .limit(Cypher.plus(new Cypher.Literal(5), new Cypher.Literal(5)))
                .skip(Cypher.plus(new Cypher.Literal(2), new Cypher.Literal(2)));

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "RETURN this0

                SKIP (2 + 2)
                LIMIT (5 + 5)"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("Return distinct", () => {
        test("Return distinct", () => {
            const node = new Cypher.Node();
            const returnQuery = new Cypher.Return(node, new Cypher.Literal(10)).distinct();

            const queryResult = returnQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"RETURN DISTINCT this0, 10"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Return distinct with order and limit param", () => {
            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Return(movieNode)
                .orderBy([movieNode.property("age")])
                .limit(new Cypher.Param(5))
                .distinct();

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                    "RETURN DISTINCT this0
                    ORDER BY this0.age ASC
                    LIMIT $param0"
                `);

            expect(queryResult.params).toMatchInlineSnapshot(`
                    {
                      "param0": 5,
                    }
                `);
        });
    });
});
