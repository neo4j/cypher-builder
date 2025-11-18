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

import Cypher from "../../../index";

describe("db.index.vector.queryNodes", () => {
    test("Simple vector", () => {
        const nearestNeighbours = 10;
        const targetNode = new Cypher.Node();
        const vectorProcedure = Cypher.db.index.vector
            .queryNodes("my-vector-index", nearestNeighbours, new Cypher.Param("This is a lovely phrase"))
            .yield(["node", targetNode]);

        const { cypher, params } = vectorProcedure.build();

        expect(cypher).toMatchInlineSnapshot(
            `"CALL db.index.vector.queryNodes('my-vector-index', 10, $param0) YIELD node AS this0"`
        );
        expect(params).toMatchInlineSnapshot(`
            {
              "param0": "This is a lovely phrase",
            }
        `);
    });
    test("Simple vector", () => {
        const nearestNeighbours = 5;
        const targetNode = new Cypher.Node();
        const vectorProcedure = Cypher.db.index.vector
            .queryNodes("my-vector-index", nearestNeighbours, new Cypher.Literal("This is a lovely phrase literal"))
            .yield(["node", targetNode]);

        const { cypher, params } = vectorProcedure.build();

        expect(cypher).toMatchInlineSnapshot(
            `"CALL db.index.vector.queryNodes('my-vector-index', 5, 'This is a lovely phrase literal') YIELD node AS this0"`
        );
        expect(params).toMatchInlineSnapshot(`{}`);
    });
    test("vector with where and return", () => {
        const nearestNeighbours = 15;
        const targetNode = new Cypher.Node();
        const vectorProcedure = Cypher.db.index.vector
            .queryNodes("my-vector-index", nearestNeighbours, new Cypher.Param("This is a lovely phrase"))
            .yield(["node", targetNode])
            .where(Cypher.eq(targetNode.property("title"), new Cypher.Param("The Matrix")))
            .return(targetNode);

        const { cypher, params } = vectorProcedure.build();

        expect(cypher).toMatchInlineSnapshot(`
"CALL db.index.vector.queryNodes('my-vector-index', 15, $param0) YIELD node AS this0
WHERE this0.title = $param1
RETURN this0"
`);
        expect(params).toMatchInlineSnapshot(`
            {
              "param0": "This is a lovely phrase",
              "param1": "The Matrix",
            }
        `);
    });
});
describe("db.index.vector.queryRelationships", () => {
    test("Simple vector", () => {
        const nearestNeighbours = 10;
        const targetNode = new Cypher.Node();
        const vectorProcedure = Cypher.db.index.vector
            .queryRelationships("my-vector-index", nearestNeighbours, new Cypher.Param("This is a lovely phrase"))
            .yield(["relationship", targetNode]);

        const { cypher, params } = vectorProcedure.build();

        expect(cypher).toMatchInlineSnapshot(
            `"CALL db.index.vector.queryRelationships('my-vector-index', 10, $param0) YIELD relationship AS this0"`
        );
        expect(params).toMatchInlineSnapshot(`
            {
              "param0": "This is a lovely phrase",
            }
        `);
    });
    test("Simple vector using literal", () => {
        const nearestNeighbours = 10;
        const targetNode = new Cypher.Node();
        const vectorProcedure = Cypher.db.index.vector
            .queryRelationships(
                "my-vector-index",
                nearestNeighbours,
                new Cypher.Literal("This is a lovely phrase literal")
            )
            .yield(["relationship", targetNode]);

        const { cypher, params } = vectorProcedure.build();

        expect(cypher).toMatchInlineSnapshot(
            `"CALL db.index.vector.queryRelationships('my-vector-index', 10, 'This is a lovely phrase literal') YIELD relationship AS this0"`
        );
        expect(params).toMatchInlineSnapshot(`{}`);
    });
    test("vector with where and return", () => {
        const nearestNeighbours = 5;
        const targetNode = new Cypher.Node();
        const vectorProcedure = Cypher.db.index.vector
            .queryRelationships("my-vector-index", nearestNeighbours, new Cypher.Param("This is a lovely phrase"))
            .yield(["relationship", targetNode])
            .where(Cypher.eq(targetNode.property("title"), new Cypher.Param("The Matrix")))
            .return(targetNode);

        const { cypher, params } = vectorProcedure.build();

        expect(cypher).toMatchInlineSnapshot(`
"CALL db.index.vector.queryRelationships('my-vector-index', 5, $param0) YIELD relationship AS this0
WHERE this0.title = $param1
RETURN this0"
`);
        expect(params).toMatchInlineSnapshot(`
            {
              "param0": "This is a lovely phrase",
              "param1": "The Matrix",
            }
        `);
    });
});
