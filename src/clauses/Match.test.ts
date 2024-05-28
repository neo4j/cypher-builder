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

import type { Predicate } from "..";
import Cypher from "..";

describe("CypherBuilder Match", () => {
    test("Match node", () => {
        const movieNode = new Cypher.Node({
            labels: ["Movie"],
        });

        const matchQuery = new Cypher.Match(
            new Cypher.Pattern(movieNode).withProperties({
                test: new Cypher.Param("test-value"),
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

    test("Match node with return passing a clause", () => {
        const movieNode = new Cypher.Node({
            labels: ["Movie"],
        });

        const returnClause = new Cypher.Return(movieNode);

        const matchQuery = new Cypher.Match(movieNode).return(returnClause);

        const queryResult = matchQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            RETURN this0"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Match with remove", () => {
        const idParam = new Cypher.Param("my-id");
        const nameParam = new Cypher.Param("my-name");

        const movieNode = new Cypher.Node({
            labels: ["Movie"],
        });

        const matchQuery = new Cypher.Match(movieNode)
            .where(movieNode, { id: idParam, name: nameParam })
            .remove(movieNode.property("name"))
            .return(movieNode.property("id"));

        const queryResult = matchQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            WHERE (this0.id = $param0 AND this0.name = $param1)
            REMOVE this0.name
            RETURN this0.id"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "my-id",
              "param1": "my-name",
            }
        `);
    });

    test("Match with remove with multiple properties", () => {
        const idParam = new Cypher.Param("my-id");
        const nameParam = new Cypher.Param("my-name");

        const movieNode = new Cypher.Node({
            labels: ["Movie"],
        });

        const matchQuery = new Cypher.Match(movieNode)
            .where(movieNode, { id: idParam, name: nameParam })
            .remove(movieNode.property("name"), movieNode.property("released"))
            .return(movieNode.property("id"));

        const queryResult = matchQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            WHERE (this0.id = $param0 AND this0.name = $param1)
            REMOVE this0.name,this0.released
            RETURN this0.id"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "my-id",
              "param1": "my-name",
            }
        `);
    });

    test("Optional match", () => {
        const movieNode = new Cypher.Node({
            labels: ["Movie"],
        });

        const pattern = new Cypher.Pattern(movieNode).withProperties({
            test: new Cypher.Param("test-value"),
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
                new Cypher.Pattern(movieNode).withProperties({
                    test: new Cypher.Param("test-value"),
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
                new Cypher.Pattern(movieNode).withProperties({
                    test: new Cypher.Param("test-value"),
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
                new Cypher.Pattern(movieNode).withProperties({
                    test: new Cypher.Param("test-value"),
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

        test("Match where with property and not", () => {
            const node = new Cypher.Node({ labels: ["Movie"] });

            const queryMatch = new Cypher.Match(node).where(
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

        test("Match node with NOT and OR operator", () => {
            const nameParam = new Cypher.Param("my-name");
            const ageParam = new Cypher.Param(5);

            const movieNode = new Cypher.Node({
                labels: ["Movie"],
            });

            const matchQuery = new Cypher.Match(movieNode)
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
            const movieNode = new Cypher.Node({
                labels: ["Movie"],
            });

            const matchQuery = new Cypher.Match(movieNode).where(new Cypher.Raw("")).return(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH (this0:Movie)
                RETURN this0"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Match where with undefined predicate", () => {
            const movieNode = new Cypher.Node({
                labels: ["Movie"],
            });

            const maybePredicate: Predicate | undefined = undefined;

            const matchQuery = new Cypher.Match(movieNode).where(maybePredicate).return(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
RETURN this0"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
        test("Match where ... and with undefined predicate", () => {
            const movieNode = new Cypher.Node({
                labels: ["Movie"],
            });

            const maybePredicate: Predicate | undefined = undefined;

            const matchQuery = new Cypher.Match(movieNode)
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

    describe("With update", () => {
        test("Match and update movie", () => {
            const nameParam = new Cypher.Param("Keanu Reeves");
            const evilKeanu = new Cypher.Param("Seveer unaeK");

            const personNode = new Cypher.Node({
                labels: ["Person"],
            });

            const matchQuery = new Cypher.Match(personNode)
                .where(personNode, { name: nameParam })
                .set([personNode.property("name"), evilKeanu])
                .return(personNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH (this0:Person)
                WHERE this0.name = $param0
                SET
                    this0.name = $param1
                RETURN this0"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "Keanu Reeves",
                  "param1": "Seveer unaeK",
                }
            `);
        });
    });

    describe("With delete", () => {
        test("Match and delete with return", () => {
            const idParam = new Cypher.Param("my-id");
            const nameParam = new Cypher.Param("my-name");

            const movieNode = new Cypher.Node({
                labels: ["Movie"],
            });

            const matchQuery = new Cypher.Match(movieNode)
                .where(movieNode, { id: idParam, name: nameParam })
                .delete(movieNode)
                .return(new Cypher.Literal(5));

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH (this0:Movie)
                WHERE (this0.id = $param0 AND this0.name = $param1)
                DELETE this0
                RETURN 5"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "my-id",
                  "param1": "my-name",
                }
            `);
        });

        test("Match and detach delete", () => {
            const idParam = new Cypher.Param("my-id");
            const nameParam = new Cypher.Param("my-name");

            const movieNode = new Cypher.Node({
                labels: ["Movie"],
            });

            const matchQuery = new Cypher.Match(movieNode)
                .where(movieNode, { id: idParam, name: nameParam })
                .detachDelete(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH (this0:Movie)
                WHERE (this0.id = $param0 AND this0.name = $param1)
                DETACH DELETE this0"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "my-id",
                  "param1": "my-name",
                }
            `);
        });

        test("Match and noDetach delete", () => {
            const idParam = new Cypher.Param("my-id");
            const nameParam = new Cypher.Param("my-name");

            const movieNode = new Cypher.Node({
                labels: ["Movie"],
            });

            const matchQuery = new Cypher.Match(movieNode)
                .where(movieNode, { id: idParam, name: nameParam })
                .noDetachDelete(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH (this0:Movie)
                WHERE (this0.id = $param0 AND this0.name = $param1)
                NODETACH DELETE this0"
            `);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "my-id",
                  "param1": "my-name",
                }
            `);
        });
    });

    describe("Nested Match", () => {
        test("Match.match()", () => {
            const movie1 = new Cypher.Node({
                labels: ["Movie"],
            });

            const movie2 = new Cypher.Node({
                labels: ["Movie"],
            });

            const matchQuery = new Cypher.Match(movie1)
                .where(Cypher.eq(movie1.property("title"), new Cypher.Param("movie1")))
                .match(new Cypher.Pattern(movie2))
                .where(Cypher.eq(movie1.property("title"), new Cypher.Param("movie2")));

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE this0.title = $param0
MATCH (this1:Movie)
WHERE this0.title = $param1"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "movie1",
  "param1": "movie2",
}
`);
        });

        test("Match.match() passing an existing Match clause", () => {
            const movie1 = new Cypher.Node({
                labels: ["Movie"],
            });

            const movie2 = new Cypher.Node({
                labels: ["Movie"],
            });

            const secondMatch = new Cypher.Match(movie2).where(
                Cypher.eq(movie1.property("title"), new Cypher.Param("movie2"))
            );

            const matchQuery = new Cypher.Match(movie1)
                .where(Cypher.eq(movie1.property("title"), new Cypher.Param("movie1")))
                .match(secondMatch);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE this0.title = $param0
MATCH (this1:Movie)
WHERE this0.title = $param1"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "movie1",
  "param1": "movie2",
}
`);
        });

        test("Match.optionalMatch()", () => {
            const movie1 = new Cypher.Node({
                labels: ["Movie"],
            });

            const movie2 = new Cypher.Node({
                labels: ["Movie"],
            });

            const matchQuery = new Cypher.Match(movie1)
                .where(Cypher.eq(movie1.property("title"), new Cypher.Param("movie1")))
                .optionalMatch(new Cypher.Pattern(movie2))
                .where(Cypher.eq(movie1.property("title"), new Cypher.Param("movie2")));

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE this0.title = $param0
OPTIONAL MATCH (this1:Movie)
WHERE this0.title = $param1"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "movie1",
  "param1": "movie2",
}
`);
        });
    });

    describe("Match.callProcedure", () => {
        test("Match.match()", () => {
            const movie1 = new Cypher.Node({
                labels: ["Movie"],
            });

            const labels = new Cypher.Variable();

            const matchQuery = new Cypher.Match(movie1)
                .where(Cypher.eq(movie1.property("title"), new Cypher.Param("movie1")))
                .callProcedure(new Cypher.Procedure("db.labels"))
                .yield(["label", labels])
                .return(labels);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE this0.title = $param0
CALL db.labels() YIELD label AS var1
RETURN var1"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "movie1",
}
`);
        });
    });
});
