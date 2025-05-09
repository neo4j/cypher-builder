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

describe("Cypher version", () => {
    test("Add cypher version on .build", () => {
        const movieNode = new Cypher.Node();
        const pattern = new Cypher.Pattern(movieNode, { labels: ["Movie"] });

        const matchQuery = new Cypher.Match(pattern)
            .where(movieNode, {
                title: new Cypher.Param("The Matrix"),
            })
            .return(movieNode.property("title"));

        const { cypher } = matchQuery.build({
            cypherVersion: "5",
        });

        expect(cypher).toMatchInlineSnapshot(`
"CYPHER 5
MATCH (this0:Movie)
WHERE this0.title = $param0
RETURN this0.title"
`);
    });
});
