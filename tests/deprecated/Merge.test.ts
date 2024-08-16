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

describe("CypherBuilder Merge - Deprecated", () => {
    test("Merge node onCreateSet", () => {
        const node = new Cypher.Node({
            labels: ["MyLabel"],
        });

        const query = new Cypher.Merge(node).onCreateSet([node.property("age"), new Cypher.Param(23)]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MERGE (this0:MyLabel)
            ON CREATE SET
                this0.age = $param0"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 23,
            }
        `);
    });

    test("Merge node with set and onCreate", () => {
        const node = new Cypher.Node({
            labels: ["MyLabel"],
        });

        const query = new Cypher.Merge(node)
            .set([node.property("age"), new Cypher.Param(10)])
            .onCreateSet([node.property("age"), new Cypher.Param(23)]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)
ON CREATE SET
    this0.age = $param1
SET
    this0.age = $param0"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": 10,
  "param1": 23,
}
`);
    });

    test("Merge node onCreate with escaped property", () => {
        const node = new Cypher.Node({
            labels: ["MyLabel"],
        });

        const query = new Cypher.Merge(node).onCreateSet([node.property("$age"), new Cypher.Param(23)]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MERGE (this0:MyLabel)
            ON CREATE SET
                this0.\`$age\` = $param0"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 23,
            }
        `);
    });

    test("Merge relationship", () => {
        const node1 = new Cypher.Node({});
        const node2 = new Cypher.Node({});

        const relationship = new Cypher.Relationship();
        const pattern = new Cypher.Pattern(node1).related(relationship).to(node2);
        const query = new Cypher.Merge(pattern)
            .onCreateSet(
                [node1.property("age"), new Cypher.Param(23)],
                [node1.property("name"), new Cypher.Param("Keanu")],
                [relationship.property("screentime"), new Cypher.Param(10)]
            )
            .return([node1.property("title"), "movie"]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MERGE (this0)-[this1]->(this2)
            ON CREATE SET
                this0.age = $param0,
                this0.name = $param1,
                this1.screentime = $param2
            RETURN this0.title AS movie"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 23,
              "param1": "Keanu",
              "param2": 10,
            }
        `);
    });

    test("Merge relationship with path assign", () => {
        const node1 = new Cypher.Node({});
        const node2 = new Cypher.Node({});

        const relationship = new Cypher.Relationship();
        const pattern = new Cypher.Pattern(node1).related(relationship).to(node2);
        const path = new Cypher.Path();
        const query = new Cypher.Merge(pattern)
            .assignToPath(path)
            .onCreateSet(
                [node1.property("age"), new Cypher.Param(23)],
                [node1.property("name"), new Cypher.Param("Keanu")],
                [relationship.property("screentime"), new Cypher.Param(10)]
            )
            .return([node1.property("title"), "movie"]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MERGE p0 = (this1)-[this2]->(this3)
            ON CREATE SET
                this1.age = $param0,
                this1.name = $param1,
                this2.screentime = $param2
            RETURN this1.title AS movie"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 23,
              "param1": "Keanu",
              "param2": 10,
            }
        `);
    });

    test("Merge node, remove and delete", () => {
        const node = new Cypher.Node({
            labels: ["MyLabel"],
        });

        const query = new Cypher.Merge(node).remove(node.property("title")).delete(node);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)
REMOVE this0.title
DELETE this0"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Chained Merge", () => {
        const node1 = new Cypher.Node({
            labels: ["MyLabel"],
        });
        const node2 = new Cypher.Node({
            labels: ["MyOtherLabel"],
        });

        const query = new Cypher.Merge(node1).merge(node2);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)
MERGE (this1:MyOtherLabel)"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Chained Merge with existing clause", () => {
        const node1 = new Cypher.Node({
            labels: ["MyLabel"],
        });
        const node2 = new Cypher.Node({
            labels: ["MyOtherLabel"],
        });

        const query = new Cypher.Merge(node1).merge(new Cypher.Merge(node2));

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)
MERGE (this1:MyOtherLabel)"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Merge node onMatchSet", () => {
        const node = new Cypher.Node({
            labels: ["MyLabel"],
        });

        const query = new Cypher.Merge(node).onMatchSet([node.property("age"), new Cypher.Param(23)]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MERGE (this0:MyLabel)
            ON MATCH SET
                this0.age = $param0"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 23,
            }
        `);
    });

    test("Merge node with onMatch and onCreate", () => {
        const node = new Cypher.Node({
            labels: ["MyLabel"],
        });

        const countProp = node.property("count");
        const query = new Cypher.Merge(node)
            .onCreateSet([countProp, new Cypher.Literal(1)])
            .onMatchSet([countProp, Cypher.plus(countProp, new Cypher.Literal(1))]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)
ON MATCH SET
    this0.count = (this0.count + 1)
ON CREATE SET
    this0.count = 1"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
