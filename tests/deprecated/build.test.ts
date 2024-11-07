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

describe("Variable escaping", () => {
    test("Should escape prefix", () => {
        const movie = new Cypher.Node({ labels: ["My Movie"] });
        const match = new Cypher.Match(movie).return(movie);

        const { cypher, params } = match.build("my prefix");

        expect(cypher).toMatchInlineSnapshot(`
        "MATCH (\`my prefixthis0\`:\`My Movie\`)
        RETURN \`my prefixthis0\`"
    `);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    describe.each([":", "&"] as const)("Config.labelOperator", (labelOperator) => {
        const config: Cypher.BuildConfig = {
            labelOperator,
        };

        test("Pattern", () => {
            const node = new Cypher.Node({ labels: ["Movie", "Film"] });
            const query = new Cypher.Match(node);

            const queryResult = new TestClause(query).build(undefined, {}, config);

            expect(queryResult.cypher).toBe(`MATCH (this0:Movie${labelOperator}Film)`);
        });

        test("hasLabel", () => {
            const node = new Cypher.Node({ labels: ["Movie"] });
            const query = new Cypher.Match(node).where(node.hasLabels("Movie", "Film"));

            const queryResult = new TestClause(query).build(undefined, {}, config);

            expect(queryResult.cypher).toBe(`MATCH (this0:Movie)
WHERE this0:Movie${labelOperator}Film`);
        });
    });
});
