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

import Cypher from "..";
import type { Predicate } from "..";

describe("CypherBuilder Match", () => {
    test("Match node", () => {
        const movieNode = new Cypher.Node();

        const matchQuery = new Cypher.Match(
            new Cypher.Pattern(movieNode, {
                labels: ["Movie"],
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

    test("Match node with return passing a clause", () => {
        const movieNode = new Cypher.Node();

        const returnClause = new Cypher.Return(movieNode);

        const matchQuery = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] })).return(returnClause);

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

        const movieNode = new Cypher.Node();

        const matchQuery = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
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

        const movieNode = new Cypher.Node();

        const matchQuery = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
            .where(movieNode, { id: idParam, name: nameParam })
            .remove(movieNode.property("name"), movieNode.property("released"))
            .return(movieNode.property("id"));

        const queryResult = matchQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE (this0.id = $param0 AND this0.name = $param1)
REMOVE this0.name, this0.released
RETURN this0.id"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "my-id",
              "param1": "my-name",
            }
        `);
    });

    test("With foreach", () => {
        const start = new Cypher.Node();
        const path = new Cypher.PathVariable();
        const end = new Cypher.Node();
        const n = new Cypher.Variable();

        const matchQuery = new Cypher.Match(
            new Cypher.Pattern(start)
                .related({
                    length: "*",
                })
                .to(end)
                .assignTo(path)
        )
            .foreach(n)
            .in(Cypher.nodes(path))
            .do(new Cypher.Merge(new Cypher.Pattern(n).related().to(end)));

        const queryResult = matchQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH p2 = (this0)-[*]->(this1)
FOREACH (var3 IN nodes(p2) |
    MERGE (var3)-[]->(this1)
)"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Quantified pattern", () => {
        const m = new Cypher.Node();
        const m2 = new Cypher.Node();

        const quantifiedPath = new Cypher.QuantifiedPath(
            new Cypher.Pattern(m, { labels: ["Movie"], properties: { title: new Cypher.Param("V for Vendetta") } }),
            new Cypher.Pattern({ labels: ["Movie"] })
                .related({ type: "ACTED_IN" })
                .to({ labels: ["Person"] })
                .quantifier({ min: 1, max: 2 }),
            new Cypher.Pattern(m2, {
                labels: ["Movie"],
                properties: { title: new Cypher.Param("Something's Gotta Give") },
            })
        );

        const matchQuery = new Cypher.Match(quantifiedPath).return(m2);
        const queryResult = matchQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie { title: $param0 })
      ((:Movie)-[:ACTED_IN]->(:Person)){1,2}
      (this1:Movie { title: $param1 })
RETURN this1"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "V for Vendetta",
  "param1": "Something's Gotta Give",
}
`);
    });

    describe("Assign to path variable", () => {
        const a = new Cypher.Node();
        const b = new Cypher.Node();
        const rel = new Cypher.Relationship();

        const pattern = new Cypher.Pattern(a)
            .related(rel, {
                type: "ACTED_IN",
            })
            .to(b);

        test("with unique id", () => {
            const path = new Cypher.PathVariable();

            const query = new Cypher.Match(pattern.assignTo(path)).return(path);

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH p3 = (this0)-[this1:ACTED_IN]->(this2)
RETURN p3"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("with named path", () => {
            const path = new Cypher.NamedPathVariable("my-path");

            const query = new Cypher.Match(pattern.assignTo(path)).return(path);

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "MATCH \`my-path\` = (this0)-[this1:ACTED_IN]->(this2)
                RETURN \`my-path\`"
            `);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("using fluent match.match method", () => {
            const path = new Cypher.PathVariable();

            const query = new Cypher.Match(new Cypher.Pattern(a)).match(pattern.assignTo(path)).return(path);

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
MATCH p3 = (this0)-[this1:ACTED_IN]->(this2)
RETURN p3"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("using fluent with.match method", () => {
            const path = new Cypher.PathVariable();

            const query = new Cypher.With(a).match(pattern.assignTo(path)).return(path);

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH this0
MATCH p3 = (this0)-[this1:ACTED_IN]->(this2)
RETURN p3"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("in OptionalMatch", () => {
            const path = new Cypher.PathVariable();

            const query = new Cypher.OptionalMatch(pattern.assignTo(path)).return(path);

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"OPTIONAL MATCH p3 = (this0)-[this1:ACTED_IN]->(this2)
RETURN p3"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
        test("with chained .optionalMatch", () => {
            const path = new Cypher.PathVariable();

            const query = new Cypher.Match(new Cypher.Pattern(a)).optionalMatch(pattern.assignTo(path)).return(path);

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
OPTIONAL MATCH p3 = (this0)-[this1:ACTED_IN]->(this2)
RETURN p3"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("With where", () => {
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

    describe("With update", () => {
        test("Match and update movie", () => {
            const nameParam = new Cypher.Param("Keanu Reeves");
            const evilKeanu = new Cypher.Param("Seveer unaeK");

            const personNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(new Cypher.Pattern(personNode, { labels: ["Person"] }))
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

    test("Match with order by", () => {
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
            .orderBy([movieNode.property("title"), "DESC"])
            .skip(10)
            .limit(2)
            .where(movieNode, { id: idParam, name: nameParam, age: ageParam })
            .return(movieNode);

        const queryResult = matchQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie { test: $param0 })
WHERE ((this0.id = $param1 AND this0.name = $param2) AND this0.age = $param3)
ORDER BY this0.title DESC
SKIP 10
LIMIT 2
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

    describe("With delete", () => {
        test("Match and delete with return", () => {
            const idParam = new Cypher.Param("my-id");
            const nameParam = new Cypher.Param("my-name");

            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
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

            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
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

            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
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
            const movie1 = new Cypher.Node();

            const movie2 = new Cypher.Node();

            const matchQuery = new Cypher.Match(new Cypher.Pattern(movie1, { labels: ["Movie"] }))
                .where(Cypher.eq(movie1.property("title"), new Cypher.Param("movie1")))
                .match(new Cypher.Pattern(movie2, { labels: ["Movie"] }))
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
            const movie1 = new Cypher.Node();

            const movie2 = new Cypher.Node();

            const secondMatch = new Cypher.Match(new Cypher.Pattern(movie2, { labels: ["Movie"] })).where(
                Cypher.eq(movie1.property("title"), new Cypher.Param("movie2"))
            );

            const matchQuery = new Cypher.Match(new Cypher.Pattern(movie1, { labels: ["Movie"] }))
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
    });

    describe("Match.callProcedure", () => {
        test("Match.match()", () => {
            const movie1 = new Cypher.Node();

            const labels = new Cypher.Variable();

            const matchQuery = new Cypher.Match(new Cypher.Pattern(movie1, { labels: ["Movie"] }))
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

    describe("Match.call", () => {
        test("Match.call with variable scope", () => {
            const movieNode = new Cypher.Node();
            const actorNode = new Cypher.Node();

            const match = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
                .match(new Cypher.Pattern(actorNode, { labels: ["Actor"] }))
                .call(new Cypher.Create(new Cypher.Pattern(movieNode).related().to(actorNode)), [movieNode, actorNode])
                .return(movieNode);

            const { cypher, params } = match.build();
            expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
MATCH (this1:Actor)
CALL (this0, this1) {
    CREATE (this0)-[]->(this1)
}
RETURN this0"
`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });

        test("Match.optionalCall with variable scope", () => {
            const movieNode = new Cypher.Node();
            const actorNode = new Cypher.Node();

            const match = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
                .match(new Cypher.Pattern(actorNode, { labels: ["Actor"] }))
                .optionalCall(new Cypher.Create(new Cypher.Pattern(movieNode).related().to(actorNode)), [
                    movieNode,
                    actorNode,
                ])
                .return(movieNode);

            const { cypher, params } = match.build();
            expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
MATCH (this1:Actor)
OPTIONAL CALL (this0, this1) {
    CREATE (this0)-[]->(this1)
}
RETURN this0"
`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("SHORTEST paths", () => {
        test("SHORTEST k", () => {
            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(
                new Cypher.Pattern(movieNode, {
                    labels: ["Movie"],
                    properties: {
                        test: new Cypher.Param("test-value"),
                    },
                })
                    .related()
                    .to(new Cypher.Node(), {
                        labels: ["Person"],
                    })
            )
                .shortest(2)
                .return(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH SHORTEST 2 (this0:Movie { test: $param0 })-[]->(this1:Person)
RETURN this0"
`);
        });

        test("SHORTEST k GROUPS", () => {
            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(
                new Cypher.Pattern(movieNode, {
                    labels: ["Movie"],
                    properties: {
                        test: new Cypher.Param("test-value"),
                    },
                })
                    .related()
                    .to(new Cypher.Node(), {
                        labels: ["Person"],
                    })
            )
                .shortestGroups(2)
                .return(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH SHORTEST 2 GROUPS (this0:Movie { test: $param0 })-[]->(this1:Person)
RETURN this0"
`);
        });

        test("ALL SHORTEST", () => {
            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(
                new Cypher.Pattern(movieNode, {
                    labels: ["Movie"],
                    properties: {
                        test: new Cypher.Param("test-value"),
                    },
                })
                    .related()
                    .to(new Cypher.Node(), {
                        labels: ["Person"],
                    })
            )
                .allShortest()
                .return(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH ALL SHORTEST (this0:Movie { test: $param0 })-[]->(this1:Person)
RETURN this0"
`);
        });

        test("ANY", () => {
            const movieNode = new Cypher.Node();

            const matchQuery = new Cypher.Match(
                new Cypher.Pattern(movieNode, {
                    labels: ["Movie"],
                    properties: {
                        test: new Cypher.Param("test-value"),
                    },
                })
                    .related()
                    .to(new Cypher.Node(), {
                        labels: ["Person"],
                    })
            )
                .any()
                .return(movieNode);

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH ANY (this0:Movie { test: $param0 })-[]->(this1:Person)
RETURN this0"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "test-value",
                }
            `);
        });

        test("SHORTEST with quantified path", () => {
            const m = new Cypher.Node();
            const m2 = new Cypher.Node();

            const quantifiedPath = new Cypher.QuantifiedPath(
                new Cypher.Pattern(m, {
                    labels: ["Movie"],
                    properties: { title: new Cypher.Param("V for Vendetta") },
                }),
                new Cypher.Pattern({ labels: ["Movie"] })
                    .related({ type: "ACTED_IN" })
                    .to({ labels: ["Person"] })
                    .quantifier({ min: 1, max: 2 }),
                new Cypher.Pattern(m2, {
                    labels: ["Movie"],
                    properties: { title: new Cypher.Param("Something's Gotta Give") },
                })
            );

            const query = new Cypher.Match(quantifiedPath).shortest(2).return(m2);
            const queryResult = query.build();

            expect(queryResult.cypher).toMatchInlineSnapshot(`
    "MATCH SHORTEST 2 (this0:Movie { title: $param0 })
          ((:Movie)-[:ACTED_IN]->(:Person)){1,2}
          (this1:Movie { title: $param1 })
    RETURN this1"
    `);
            expect(queryResult.params).toMatchInlineSnapshot(`
    {
      "param0": "V for Vendetta",
      "param1": "Something's Gotta Give",
    }
    `);
        });
    });

    describe("Optional Match", () => {
        test("Optional match", () => {
            const movieNode = new Cypher.Node();

            const pattern = new Cypher.Pattern(movieNode, {
                labels: ["Movie"],
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

        test("Match.optionalMatch()", () => {
            const movie1 = new Cypher.Node();

            const movie2 = new Cypher.Node();

            const matchQuery = new Cypher.Match(new Cypher.Pattern(movie1, { labels: ["Movie"] }))
                .where(Cypher.eq(movie1.property("title"), new Cypher.Param("movie1")))
                .optionalMatch(new Cypher.Pattern(movie2, { labels: ["Movie"] }))
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

        test("Match.optionalMatch() passing existing OptionalMatch clause", () => {
            const movie1 = new Cypher.Node();

            const movie2 = new Cypher.Node();

            const secondMatch = new Cypher.OptionalMatch(new Cypher.Pattern(movie2, { labels: ["Movie"] })).where(
                Cypher.eq(movie1.property("title"), new Cypher.Param("movie2"))
            );

            const matchQuery = new Cypher.Match(new Cypher.Pattern(movie1, { labels: ["Movie"] }))
                .where(Cypher.eq(movie1.property("title"), new Cypher.Param("movie1")))
                .optionalMatch(secondMatch);
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

        test("With.optionalMatch() passing existing OptionalMatch clause", () => {
            const movie1 = new Cypher.Node();

            const movie2 = new Cypher.Node();

            const secondMatch = new Cypher.OptionalMatch(new Cypher.Pattern(movie2, { labels: ["Movie"] })).where(
                Cypher.eq(movie1.property("title"), new Cypher.Param("movie2"))
            );

            const query = new Cypher.With(movie1).optionalMatch(secondMatch);
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH this0
OPTIONAL MATCH (this1:Movie)
WHERE this0.title = $param0"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "movie2",
}
`);
        });
    });

    describe("Multiple match patterns", () => {
        test("Two patterns", () => {
            const actor = new Cypher.Node();
            const movie = new Cypher.Node();
            const moreActors = new Cypher.Node();

            const pattern1 = new Cypher.Pattern(actor, { labels: ["Person"] })
                .related({ type: "ACTED_IN", direction: "undirected" })
                .to(movie, { labels: ["Movie"] });

            const pattern2 = new Cypher.Pattern(moreActors, { labels: ["Person"] })
                .related({ type: "ACTED_IN", direction: "undirected" })
                .to(movie);

            const matchQuery = new Cypher.Match(pattern1, pattern2).return(new Cypher.Return(actor, moreActors, movie));

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH
  (this0:Person)-[:ACTED_IN]-(this1:Movie),
  (this2:Person)-[:ACTED_IN]-(this1)
RETURN this0, this2, this1"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Spread of patterns", () => {
            const actor = new Cypher.Node();
            const movie = new Cypher.Node();
            const moreActors = new Cypher.Node();

            const pattern1 = new Cypher.Pattern(actor, { labels: ["Person"] })
                .related({ type: "ACTED_IN", direction: "undirected" })
                .to(movie, { labels: ["Movie"] });

            const pattern2 = new Cypher.Pattern(moreActors, { labels: ["Person"] })
                .related({ type: "ACTED_IN", direction: "undirected" })
                .to(movie);

            const patterns = [pattern1, pattern2];

            const matchQuery = new Cypher.Match(...patterns).return(new Cypher.Return(actor, moreActors, movie));

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH
  (this0:Person)-[:ACTED_IN]-(this1:Movie),
  (this2:Person)-[:ACTED_IN]-(this1)
RETURN this0, this2, this1"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("SHORTEST with multiple patterns should throw", () => {
            const actor = new Cypher.Node();
            const movie = new Cypher.Node();
            const moreActors = new Cypher.Node();

            const pattern1 = new Cypher.Pattern(actor, { labels: ["Person"] })
                .related({ type: "ACTED_IN", direction: "undirected" })
                .to(movie, { labels: ["Movie"] });

            const pattern2 = new Cypher.Pattern(moreActors, { labels: ["Person"] })
                .related({ type: "ACTED_IN", direction: "undirected" })
                .to(movie);

            const matchQuery = new Cypher.Match(pattern1, pattern2)
                .shortest(2)
                .return(new Cypher.Return(actor, moreActors, movie));

            expect(() => {
                matchQuery.build();
            }).toThrow("Shortest cannot be used with multiple path patterns");
        });

        test("OPTIONAL MATCH with multiple patterns", () => {
            const actor = new Cypher.Node();
            const movie = new Cypher.Node();
            const moreActors = new Cypher.Node();

            const pattern1 = new Cypher.Pattern(actor, { labels: ["Person"] })
                .related({ type: "ACTED_IN", direction: "undirected" })
                .to(movie, { labels: ["Movie"] });

            const pattern2 = new Cypher.Pattern(moreActors, { labels: ["Person"] })
                .related({ type: "ACTED_IN", direction: "undirected" })
                .to(movie);

            const matchQuery = new Cypher.OptionalMatch(pattern1, pattern2).return(
                new Cypher.Return(actor, moreActors, movie)
            );

            const queryResult = matchQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"OPTIONAL MATCH
  (this0:Person)-[:ACTED_IN]-(this1:Movie),
  (this2:Person)-[:ACTED_IN]-(this1)
RETURN this0, this2, this1"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Undefined pattern should throw", () => {
            const actor = new Cypher.Node();
            const movie = new Cypher.Node();
            const moreActors = new Cypher.Node();

            expect(() => {
                new Cypher.Match().return(new Cypher.Return(actor, moreActors, movie));
            }).toThrow(`At least one pattern must be provided to Match`);
        });
    });
});
