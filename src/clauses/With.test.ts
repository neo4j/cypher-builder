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

describe("CypherBuilder With", () => {
    test("With *", () => {
        const withQuery = new Cypher.With("*");

        const queryResult = withQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"WITH *"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("With nodes", () => {
        const node = new Cypher.Node();
        const withQuery = new Cypher.With(node);

        const queryResult = withQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"WITH this0"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("With distinct", () => {
        const node = new Cypher.Node();
        const withQuery = new Cypher.With(node).distinct();

        const queryResult = withQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"WITH DISTINCT this0"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("With clause after with", () => {
        const node = new Cypher.Node();
        const withQuery = new Cypher.With(node);

        const nestedWith = withQuery.with(node);
        nestedWith.addColumns("*");

        const queryResult = withQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
        "WITH this0
        WITH *, this0"
    `);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("With clause after chained with", () => {
        const node = new Cypher.Node();
        const withQuery = new Cypher.With(node).with(node).with("*");

        const queryResult = withQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "WITH this0
            WITH this0
            WITH *"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Existing with clause chained  after with", () => {
        const node = new Cypher.Node();
        const secondWith = new Cypher.With(node);
        const withQuery = new Cypher.With(node).with(secondWith).with("*");

        const queryResult = withQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "WITH this0
            WITH this0
            WITH *"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("With clause ignores multiple *", () => {
        const node = new Cypher.Node();
        const withQuery = new Cypher.With(node, "*", "*");

        const queryResult = withQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"WITH *, this0"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("With multiple variables", () => {
        const node = new Cypher.Node();
        const variable = new Cypher.Variable();
        const param = new Cypher.Param("Matrix");

        const withQuery = new Cypher.With(node, variable, param);

        const queryResult = withQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"WITH this0, var1, $param0"`);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "Matrix",
            }
        `);
    });

    describe("With alias", () => {
        test("With variable aliased", () => {
            const node = new Cypher.Node();
            const alias = new Cypher.Variable();
            const withQuery = new Cypher.With([node, alias]);

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"WITH this0 AS var1"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("With a string alias", () => {
            const node = new Cypher.Node();
            const withQuery = new Cypher.With([node, "my-alias"]);

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"WITH this0 AS my-alias"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("With expression aliased", () => {
            const expr = Cypher.plus(new Cypher.Param("The "), new Cypher.Param("Matrix"));
            const alias = new Cypher.Variable();
            const withQuery = new Cypher.With([expr, alias]);

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"WITH ($param0 + $param1) AS var0"`);
            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "The ",
                  "param1": "Matrix",
                }
            `);
        });

        test("With alias and delete", () => {
            const node = new Cypher.Node();
            const alias = new Cypher.Variable();
            const withQuery = new Cypher.With([node, alias]).detachDelete(alias);

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "WITH this0 AS var1
                DETACH DELETE var1"
            `);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("With delete", () => {
        test("With delete", () => {
            const node = new Cypher.Node();
            const withQuery = new Cypher.With(node).delete(node);

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "WITH this0
                DELETE this0"
            `);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("With detach delete", () => {
            const node = new Cypher.Node();
            const withQuery = new Cypher.With(node).detachDelete(node);

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
                "WITH this0
                DETACH DELETE this0"
            `);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("Chained Match", () => {
        test("chained match", () => {
            const withQuery = new Cypher.With("*").match(new Cypher.Pattern(new Cypher.Node()));

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH *
MATCH (this0)"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("chained optional match", () => {
            const withQuery = new Cypher.With("*").optionalMatch(new Cypher.Pattern(new Cypher.Node()));

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH *
OPTIONAL MATCH (this0)"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("chained match with existing clause", () => {
            const withQuery = new Cypher.With("*").match(new Cypher.Match(new Cypher.Pattern(new Cypher.Node())));

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH *
MATCH (this0)"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("Chained Create", () => {
        test("With * and create", () => {
            const withQuery = new Cypher.With("*").create(new Cypher.Pattern(new Cypher.Node(), { labels: ["Movie"] }));

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH *
CREATE (this0:Movie)"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("With * and existing create clause", () => {
            const createClause = new Cypher.Create(new Cypher.Pattern(new Cypher.Node(), { labels: ["Movie"] }));
            const withQuery = new Cypher.With("*").create(createClause);

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH *
CREATE (this0:Movie)"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("Chained Merge", () => {
        test("With * and merge", () => {
            const withQuery = new Cypher.With("*").merge(new Cypher.Pattern(new Cypher.Node(), { labels: ["Movie"] }));

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH *
MERGE (this0:Movie)"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("With * and existing merge clause", () => {
            const mergeClause = new Cypher.Merge(new Cypher.Pattern(new Cypher.Node(), { labels: ["Movie"] }));
            const withQuery = new Cypher.With("*").merge(mergeClause);

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH *
MERGE (this0:Movie)"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("Chained Procedure", () => {
        test("With * and cypher procedure", () => {
            const withQuery = new Cypher.With("*").callProcedure(Cypher.db.labels()).yield("label");

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH *
CALL db.labels() YIELD label"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("With * and cypher void procedure", () => {
            const withQuery = new Cypher.With("*").callProcedure(Cypher.apoc.util.validate(Cypher.true, "message"));

            const queryResult = withQuery.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH *
CALL apoc.util.validate(true, \\"message\\", [0])"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("Match.call", () => {
        test("Match.Call with variable scope", () => {
            const movieNode = new Cypher.Node();
            const actorNode = new Cypher.Node();

            const match = new Cypher.With(movieNode)
                .call(new Cypher.Create(new Cypher.Pattern(movieNode).related().to(actorNode)), [movieNode])
                .return(actorNode);

            const { cypher, params } = match.build();
            expect(cypher).toMatchInlineSnapshot(`
"WITH this0
CALL (this0) {
    CREATE (this0)-[]->(this1)
}
RETURN this1"
`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });
    });
});
