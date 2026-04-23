/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Predicate } from "../..";
import Cypher from "../..";

describe("Where", () => {
    describe("Match.where", () => {
        test("Match node with where", () => {
            const idParam = new Cypher.Param("my-id");
            const nameParam = new Cypher.Param("my-name");
            const ageParam = new Cypher.Param(5);

            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(
                new Cypher.Pattern(movieNode, {
                    labels: ["Movie"],
                    properties: {
                        test: new Cypher.Param("test-value"),
                    },
                })
            )
                .where(movieNode, { id: idParam, name: nameParam, age: ageParam })
                .return(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH (this0:Movie { test: $param0 })
                WHERE ((this0.id = $param1 AND this0.name = $param2) AND this0.age = $param3)
                RETURN this0"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "test-value",
                  "param1": "my-id",
                  "param2": "my-name",
                  "param3": 5,
                }
            `);
        });

        test("Match node with where...and", () => {
            const idParam = new Cypher.Param("my-id");
            const nameParam = new Cypher.Param("my-name");
            const ageParam = new Cypher.Param(5);

            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(
                new Cypher.Pattern(movieNode, {
                    labels: ["Movie"],
                    properties: {
                        test: new Cypher.Param("test-value"),
                    },
                })
            )
                .where(movieNode, { id: idParam, name: nameParam, age: ageParam })
                .and(movieNode, { value: new Cypher.Literal("Another value") })
                .return(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie { test: $param0 })
WHERE (((this0.id = $param1 AND this0.name = $param2) AND this0.age = $param3) AND this0.value = 'Another value')
RETURN this0"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "test-value",
                  "param1": "my-id",
                  "param2": "my-name",
                  "param3": 5,
                }
            `);
        });

        test("Match named node with alias and where", () => {
            const idParam = new Cypher.Param("my-id");
            const nameParam = new Cypher.Param("my-name");

            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(
                new Cypher.Pattern(movieNode, {
                    labels: ["Movie"],
                    properties: {
                        test: new Cypher.Param("test-value"),
                    },
                })
            )
                .where(movieNode, { id: idParam, name: nameParam })
                .return([movieNode.property("name"), "myAlias"]);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH (this0:Movie { test: $param0 })
                WHERE (this0.id = $param1 AND this0.name = $param2)
                RETURN this0.name AS myAlias"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "test-value",
                  "param1": "my-id",
                  "param2": "my-name",
                }
            `);
        });

        test("Match with null values", () => {
            const testParam = new Cypher.Param(null);

            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(
                new Cypher.Pattern(movieNode, {
                    labels: ["Movie"],
                    properties: {
                        test: testParam,
                    },
                })
            )
                .where(Cypher.isNull(movieNode.property("name")))
                .return(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH (this0:Movie { test: NULL })
                WHERE this0.name IS NULL
                RETURN this0"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Match Where with complex operation", () => {
            const node = new Cypher.Node();

            const param = new Cypher.Param(1);
            const clause = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] }))
                .where(
                    Cypher.and(
                        Cypher.or(Cypher.gt(param, new Cypher.Param(2)), Cypher.lt(param, new Cypher.Param(4))),
                        Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb"))
                    )
                )
                .return([node.property("title"), "movie"]);

            const queryResult = clause.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH (this0:Movie)
                WHERE (($param0 > $param1 OR $param0 < $param2) AND $param3 = $param4)
                RETURN this0.title AS movie"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": 1,
                  "param1": 2,
                  "param2": 4,
                  "param3": "aa",
                  "param4": "bb",
                }
            `);
        });

        test("Match where with property and not", () => {
            const node = new Cypher.Node();

            const queryMatch = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).where(
                Cypher.not(Cypher.eq(node.property("title"), new Cypher.Param("Matrix")))
            );

            const queryResult = queryMatch.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH (this0:Movie)
                WHERE NOT (this0.title = $param0)"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "Matrix",
                }
            `);
        });

        test("Match node with simple NOT", () => {
            const nameParam = new Cypher.Param("my-name");

            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(
                new Cypher.Pattern(movieNode, {
                    labels: ["Movie"],
                })
            )
                .where(Cypher.not(Cypher.eq(movieNode.property("name"), nameParam)))
                .return(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH (this0:Movie)
                WHERE NOT (this0.name = $param0)
                RETURN this0"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "my-name",
                }
            `);
        });

        test("Match node with NOT and OR operator", () => {
            const nameParam = new Cypher.Param("my-name");
            const ageParam = new Cypher.Param(5);

            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
                .where(
                    Cypher.not(
                        Cypher.or(
                            Cypher.eq(movieNode.property("age"), ageParam),
                            Cypher.eq(movieNode.property("name"), nameParam)
                        )
                    )
                )
                .return(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH (this0:Movie)
                WHERE NOT (this0.age = $param0 OR this0.name = $param1)
                RETURN this0"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": 5,
                  "param1": "my-name",
                }
            `);
        });

        test("Match where with empty operation", () => {
            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
                .where(new Cypher.Raw(""))
                .return(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH (this0:Movie)
                RETURN this0"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Match where with undefined predicate", () => {
            const movieNode = new Cypher.Node();

            const maybePredicate: Predicate | undefined = undefined;

            const matchQuery = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
                .where(maybePredicate)
                .return(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
RETURN this0"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Match where ... and with undefined predicate", () => {
            const movieNode = new Cypher.Node();

            const maybePredicate: Predicate | undefined = undefined;

            const matchQuery = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
                .where(Cypher.eq(new Cypher.Variable(), new Cypher.Variable()))
                .and(maybePredicate)
                .return(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE var1 = var2
RETURN this0"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });
});
