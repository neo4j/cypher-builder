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
import { TestClause } from "../../src/utils/TestClause";

describe.each([":", "&"] as const)("Config.labelOperator", (labelOperator) => {
    test("Pattern", () => {
        const node = new Cypher.Node();
        const query = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie", "Film"] }));

        const queryResult = new TestClause(query).build({
            labelOperator,
        });

        expect(queryResult.cypher).toBe(`MATCH (this0:Movie${labelOperator}Film)`);
    });

    test("hasLabel", () => {
        const node = new Cypher.Node();
        const query = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).where(
            node.hasLabels("Movie", "Film")
        );

        const queryResult = new TestClause(query).build({
            labelOperator,
        });

        expect(queryResult.cypher).toBe(`MATCH (this0:Movie)
WHERE this0:Movie${labelOperator}Film`);
    });
});
