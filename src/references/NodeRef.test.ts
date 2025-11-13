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
import { TestClause } from "../utils/TestClause";

describe("NodeRef", () => {
    test("Create node", () => {
        const node1 = new Cypher.Node();
        const node2 = new Cypher.Node();

        const testClause = new TestClause(node1, node2);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"this0this1"`);
    });

    test("Create named node", () => {
        const node1 = new Cypher.NamedNode("myNode");

        const testClause = new TestClause(node1);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"myNode"`);
        expect(node1.name).toBe("myNode");
    });
});
