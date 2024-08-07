/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Cypher from "../../src";

describe("CypherBuilder Match", () => {
    test("Match node", () => {
        const movieNode = new Cypher.Node({
            labels: ["Movie"],
        });

        const matchQuery = new Cypher.Match(
            new Cypher.Pattern(movieNode, {
                properties: {
                    test: new Cypher.Param("test-value"),
                },
            })
        );

        const queryResult = matchQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"MATCH (this0:Movie { test: $param0 })"`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "test-value",
            }
        `);
    });

    test("Optional match", () => {
        const movieNode = new Cypher.Node({
            labels: ["Movie"],
        });

        const pattern = new Cypher.Pattern(movieNode, {
            properties: {
                test: new Cypher.Param("test-value"),
            },
        });
        const matchQuery = new Cypher.OptionalMatch(pattern).return(movieNode);

        const queryResult = matchQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "OPTIONAL MATCH (this0:Movie { test: $param0 })
            RETURN this0"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "test-value",
            }
        `);
    });

    describe("Assign to path variable", () => {
        const a = new Cypher.Node();
        const b = new Cypher.Node();
        const rel = new Cypher.Relationship({
            type: "ACTED_IN",
        });

        const pattern = new Cypher.Pattern(a).related(rel).to(b);

        test("with unique id", () => {
            const path = new Cypher.Path();

            const query = new Cypher.Match(pattern).assignToPath(path).return(path);

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH p0 = (this1)-[this2:ACTED_IN]->(this3)
                RETURN p0"
            `);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("with named path", () => {
            const path = new Cypher.NamedPath("my-path");

            const query = new Cypher.Match(pattern).assignToPath(path).return(path);

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH \`my-path\` = (this0)-[this1:ACTED_IN]->(this2)
                RETURN \`my-path\`"
            `);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("With where", () => {
        test("Match node with where", () => {
            const idParam = new Cypher.Param("my-id");
            const nameParam = new Cypher.Param("my-name");
            const ageParam = new Cypher.Param(5);

            const movieNode = new Cypher.Node({
                labels: ["Movie"],
            });

            const matchQuery = new Cypher.Match(
                new Cypher.Pattern(movieNode, {
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

            const movieNode = new Cypher.Node({
                labels: ["Movie"],
            });

            const matchQuery = new Cypher.Match(
                new Cypher.Pattern(movieNode, {
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
                WHERE (((this0.id = $param1 AND this0.name = $param2) AND this0.age = $param3) AND this0.value = \\"Another value\\")
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

            const movieNode = new Cypher.Node({
                labels: ["Movie"],
            });

            const matchQuery = new Cypher.Match(
                new Cypher.Pattern(movieNode, {
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

            const movieNode = new Cypher.Node({
                labels: ["Movie"],
            });

            const matchQuery = new Cypher.Match(
                new Cypher.Pattern(movieNode).withProperties({
                    test: testParam,
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
            const node = new Cypher.Node({ labels: ["Movie"] });

            const param = new Cypher.Param(1);
            const clause = new Cypher.Match(node)
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

        test("Match node with simple NOT", () => {
            const nameParam = new Cypher.Param("my-name");

            const movieNode = new Cypher.Node({
                labels: ["Movie"],
            });

            const matchQuery = new Cypher.Match(movieNode)
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
    });
});
