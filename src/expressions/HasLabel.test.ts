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

import { TestClause } from "../utils/TestClause";
import Cypher from "..";
import { HasLabel } from "./HasLabel";

describe("HasLabel", () => {
    test("Filtering with HasLabel", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });
        const query = new Cypher.Match(node).where(node.hasLabel("Movie"));

        const queryResult = new TestClause(query).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:\`Movie\`)
            WHERE this0:\`Movie\`"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Filtering with multiple labels", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });
        const query = new Cypher.Match(node).where(node.hasLabels("Movie", "Film"));

        const queryResult = new TestClause(query).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:\`Movie\`)
            WHERE this0:\`Movie\`:\`Film\`"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Fails if no labels are provided", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });
        expect(() => {
            new HasLabel(node, []);
        }).toThrow();
    });
});
