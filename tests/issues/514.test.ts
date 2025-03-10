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

import * as Cypher from "../../src";

describe("https://github.com/neo4j/cypher-builder/pull/514", () => {
    test("SET should allow PropertyRef values", () => {
        const movie = new Cypher.Node();
        const update = new Cypher.Param({
            title: "The Matrix",
            year: 1999,
        });

        const pattern = new Cypher.Pattern(movie, {
            labels: "Movie",
            properties: {
                title: new Cypher.Property(update, "title"),
            },
        });

        const matchQuery = new Cypher.Match(pattern).set([movie, new Cypher.Property(update, "year")]);

        const queryResult = matchQuery.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie { title: $param0.title })
SET
    this0 = $param0.year"
`);
    });

    test("SET with += mutation should allow PropertyRef values", () => {
        const movie = new Cypher.Node();
        const update = new Cypher.Param({
            title: "The Matrix",
            year: 1999,
        });

        const pattern = new Cypher.Pattern(movie, {
            labels: "Movie",
            properties: {
                title: new Cypher.Property(update, "title"),
            },
        });

        const matchQuery = new Cypher.Match(pattern).set([movie, "+=", new Cypher.Property(update, "year")]);

        const queryResult = matchQuery.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie { title: $param0.title })
SET
    this0 += $param0.year"
`);
    });
});
