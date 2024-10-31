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

describe("Assign to path variable (deprecated)", () => {
    const a = new Cypher.Node();
    const b = new Cypher.Node();
    const rel = new Cypher.Relationship();

    const pattern = new Cypher.Pattern(a)
        .related(rel, {
            type: "ACTED_IN",
        })
        .to(b);

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

    test("Merge relationship with path assign", () => {
        const node1 = new Cypher.Node();
        const node2 = new Cypher.Node();

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

    test("Create Node with null property and assign path variable", () => {
        const idParam = new Cypher.Param(null);
        const testParam = new Cypher.Param(null);
        const nullStringParam = new Cypher.Param("null");

        const movieNode = new Cypher.Node();

        const properties = {
            id: idParam,
        };
        const path = new Cypher.Path();
        const createQuery = new Cypher.Create(
            new Cypher.Pattern(
                movieNode,

                {
                    labels: ["Movie"],
                    properties,
                }
            )
        )
            .assignToPath(path)
            .set([movieNode.property("test"), testParam], [movieNode.property("nullStr"), nullStringParam])
            .return(movieNode);

        const queryResult = createQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CREATE p0 = (this1:Movie { id: NULL })
            SET
                this1.test = NULL,
                this1.nullStr = $param0
            RETURN this1"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "null",
            }
        `);
    });
});
