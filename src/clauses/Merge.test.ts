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

describe("CypherBuilder Merge", () => {
    test("Merge node onCreateSet", () => {
        const node = new Cypher.Node();

        const query = new Cypher.Merge(
            new Cypher.Pattern(node, {
                labels: ["MyLabel"],
            })
        ).onCreateSet([node.property("age"), new Cypher.Param(23)]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)  
  ON CREATE SET this0.age = $param0  "
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 23,
            }
        `);
    });

    test("Merge node with set and onCreate", () => {
        const node = new Cypher.Node();

        const query = new Cypher.Merge(
            new Cypher.Pattern(node, {
                labels: ["MyLabel"],
            })
        )
            .set([node.property("age"), new Cypher.Param(10)])
            .onCreateSet([node.property("age"), new Cypher.Param(23)]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)  
  ON CREATE SET this0.age = $param1  
SET this0.age = $param0"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": 10,
  "param1": 23,
}
`);
    });

    test("Merge node onCreate with escaped property", () => {
        const node = new Cypher.Node();

        const query = new Cypher.Merge(
            new Cypher.Pattern(node, {
                labels: ["MyLabel"],
            })
        ).onCreateSet([node.property("$age"), new Cypher.Param(23)]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)  
  ON CREATE SET this0.\`$age\` = $param0  "
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 23,
            }
        `);
    });

    test("Merge node with parameters", () => {
        const node = new Cypher.Node();

        const nodeProps = {
            test: new Cypher.Param("test"),
        };

        const query = new Cypher.Merge(
            new Cypher.Pattern(node, {
                labels: ["MyLabel"],
                properties: nodeProps,
            })
        ).onCreateSet([node.property("age"), new Cypher.Param(23)]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel { test: $param0 })  
  ON CREATE SET this0.age = $param1  "
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "test",
              "param1": 23,
            }
        `);
    });

    test("Merge relationship", () => {
        const node1 = new Cypher.Node();
        const node2 = new Cypher.Node();

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
        const node1 = new Cypher.Node();
        const node2 = new Cypher.Node();

        const relationship = new Cypher.Relationship();
        const pattern = new Cypher.Pattern(node1).related(relationship).to(node2);
        const path = new Cypher.PathVariable();
        const query = new Cypher.Merge(pattern.assignTo(path))
            .onCreateSet(
                [node1.property("age"), new Cypher.Param(23)],
                [node1.property("name"), new Cypher.Param("Keanu")],
                [relationship.property("screentime"), new Cypher.Param(10)]
            )
            .return([node1.property("title"), "movie"]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE p3 = (this0)-[this1]->(this2)  
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

    test("Merge node, remove and delete", () => {
        const node = new Cypher.Node();

        const query = new Cypher.Merge(
            new Cypher.Pattern(node, {
                labels: ["MyLabel"],
            })
        )
            .remove(node.property("title"))
            .delete(node);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)    
REMOVE this0.title
DELETE this0"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Chained Merge", () => {
        const node1 = new Cypher.Node();
        const node2 = new Cypher.Node();

        const query = new Cypher.Merge(
            new Cypher.Pattern(node1, {
                labels: ["MyLabel"],
            })
        ).merge(
            new Cypher.Pattern(node2, {
                labels: ["MyOtherLabel"],
            })
        );

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)    
MERGE (this1:MyOtherLabel)    "
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Chained Merge with existing clause", () => {
        const node1 = new Cypher.Node();
        const node2 = new Cypher.Node();

        const query = new Cypher.Merge(
            new Cypher.Pattern(node1, {
                labels: ["MyLabel"],
            })
        ).merge(
            new Cypher.Merge(
                new Cypher.Pattern(node2, {
                    labels: ["MyOtherLabel"],
                })
            )
        );

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)    
MERGE (this1:MyOtherLabel)    "
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Merge node onMatchSet", () => {
        const node = new Cypher.Node();

        const query = new Cypher.Merge(
            new Cypher.Pattern(node, {
                labels: ["MyLabel"],
            })
        ).onMatchSet([node.property("age"), new Cypher.Param(23)]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)    
  ON MATCH SET this0.age = $param0"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 23,
            }
        `);
    });

    test("Merge node with onMatch and onCreate", () => {
        const node = new Cypher.Node();

        const countProp = node.property("count");
        const query = new Cypher.Merge(
            new Cypher.Pattern(node, {
                labels: ["MyLabel"],
            })
        )
            .onCreateSet([countProp, new Cypher.Literal(1)])
            .onMatchSet([countProp, Cypher.plus(countProp, new Cypher.Literal(1))]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)  
  ON CREATE SET this0.count = 1  
  ON MATCH SET this0.count = (this0.count + 1)"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Merge node onCreateSet with Finish", () => {
        const node = new Cypher.Node();

        const query = new Cypher.Merge(
            new Cypher.Pattern(node, {
                labels: ["MyLabel"],
            })
        )
            .onCreateSet([node.property("age"), new Cypher.Param(23)])
            .finish();

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)  
  ON CREATE SET this0.age = $param0  
FINISH"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 23,
            }
        `);
    });

    test("Merge node with order", () => {
        const node = new Cypher.Node();

        const query = new Cypher.Merge(
            new Cypher.Pattern(node, {
                labels: ["MyLabel"],
            })
        )
            .onCreateSet([node.property("age"), new Cypher.Param(23)])
            .orderBy([node.property("age"), "ASC"]);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MERGE (this0:MyLabel)  
  ON CREATE SET this0.age = $param0  
ORDER BY this0.age ASC"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 23,
            }
        `);
    });
});
