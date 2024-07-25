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

describe("Foreach", () => {
    test("Foreach create", () => {
        const list = new Cypher.Literal([1, 2, 3]);
        const variable = new Cypher.Variable();

        const movieNode = new Cypher.Node();
        const createMovie = new Cypher.Create(new Cypher.Pattern(movieNode, { labels: ["Movie"] })).set([
            movieNode.property("id"),
            variable,
        ]);

        const foreachClause = new Cypher.Foreach(variable, list, createMovie).with("*");

        const queryResult = foreachClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "FOREACH (var0 IN [1, 2, 3] |
                CREATE (this1:Movie)
                SET
                    this1.id = var0
            )
            WITH *"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Foreach create with set, remove and delete", () => {
        const list = new Cypher.Literal([1, 2, 3]);
        const variable = new Cypher.Variable();

        const movieNode = new Cypher.Node();
        const createMovie = new Cypher.Create(new Cypher.Pattern(movieNode, { labels: ["Movie"] }));

        const foreachClause = new Cypher.Foreach(variable, list, createMovie)
            .remove(movieNode.property("title"))
            .set([movieNode.property("id"), variable])
            .delete(movieNode)
            .with("*");

        const queryResult = foreachClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"FOREACH (var0 IN [1, 2, 3] |
    CREATE (this1:Movie)
)
SET
    this1.id = var0
REMOVE this1.title
DELETE this1
WITH *"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Foreach create detachDelete", () => {
        const list = new Cypher.Literal([1, 2, 3]);
        const variable = new Cypher.Variable();

        const movieNode = new Cypher.Node();
        const createMovie = new Cypher.Create(new Cypher.Pattern(movieNode, { labels: ["Movie"] }));

        const foreachClause = new Cypher.Foreach(variable, list, createMovie).detachDelete(movieNode).with("*");

        const queryResult = foreachClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"FOREACH (var0 IN [1, 2, 3] |
    CREATE (this1:Movie)
)
DETACH DELETE this1
WITH *"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
