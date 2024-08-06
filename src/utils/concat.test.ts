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

describe("CypherBuilder utils.concat", () => {
    test("concatenates Match and Return", () => {
        const node = new Cypher.Node();

        const clause = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).where(
            Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb"))
        );
        const returnClause = new Cypher.Return([node.property("title"), "movie"]);

        const query = Cypher.utils.concat(clause, returnClause);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            WHERE $param0 = $param1
            RETURN this0.title AS movie"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "aa",
              "param1": "bb",
            }
        `);
        expect(query.children).toHaveLength(2);
    });

    test("Create two nodes by concatenating clauses", () => {
        const titleParam = new Cypher.Param("The Matrix");

        const movie1 = new Cypher.Node();

        const movie2 = new Cypher.Node();

        // Note that both nodes share the same param
        const create1 = new Cypher.Create(
            new Cypher.Pattern(movie1, {
                labels: ["Movie"],
            })
        ).set([movie1.property("title"), titleParam]);
        const create2 = new Cypher.Create(
            new Cypher.Pattern(movie2, {
                labels: ["Movie"],
            })
        ).set([movie2.property("title"), titleParam]);

        const queryResult = Cypher.utils.concat(create1, create2).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CREATE (this0:Movie)
            SET
                this0.title = $param0
            CREATE (this1:Movie)
            SET
                this1.title = $param0"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "The Matrix",
            }
        `);
    });

    test("Empty composite clause", () => {
        const compositeClause = Cypher.utils.concat(undefined);
        expect(compositeClause.empty).toBeTrue();
        expect(compositeClause.children).toHaveLength(0);

        const queryResult = compositeClause.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`""`);
    });

    test("Empty nested composite clause", () => {
        const compositeClause = Cypher.utils.concat(Cypher.utils.concat());
        expect(compositeClause.empty).toBeTrue();
        expect(compositeClause.children).toHaveLength(0);

        const queryResult = compositeClause.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`""`);
    });

    test("Nested composite clause with multiple elements", () => {
        const compositeClause = Cypher.utils.concat(
            Cypher.utils.concat(new Cypher.Match(new Cypher.Node()), new Cypher.Match(new Cypher.Node()))
        );
        expect(compositeClause.empty).toBeFalse();
        expect(compositeClause.children).toHaveLength(1);

        const queryResult = compositeClause.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0)
            MATCH (this1)"
        `);
    });

    test("Non-Empty composite clause", () => {
        const node = new Cypher.Node();

        const clause = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).where(
            Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb"))
        );
        const compositeClause = Cypher.utils.concat(clause);
        expect(compositeClause.empty).toBeFalse();
        expect(compositeClause.children).toHaveLength(1);
    });

    test("Nested concatenation flattens the tree if composite clause has 1 element", () => {
        const node = new Cypher.Node();

        const clause = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).where(
            Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb"))
        );
        const returnClause = new Cypher.Return([node.property("title"), "movie"]);

        const nestedConcat = Cypher.utils.concat(clause);

        const topLevelConcat = Cypher.utils.concat(nestedConcat, returnClause);

        const queryResult = topLevelConcat.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            WHERE $param0 = $param1
            RETURN this0.title AS movie"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "aa",
              "param1": "bb",
            }
        `);

        // Three children as nested concat was flattened
        expect(topLevelConcat.children).toHaveLength(2);
    });
});
