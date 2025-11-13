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

describe("LoadCSV", () => {
    test("Simple LoadCSV", () => {
        const row = new Cypher.Variable();
        const loadClause = new Cypher.LoadCSV("https://data.neo4j.com/bands/artists.csv", row).return(row);

        const queryResult = loadClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"LOAD CSV FROM \\"https://data.neo4j.com/bands/artists.csv\\" AS var0
RETURN var0"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("LoadCSV with headers", () => {
        const row = new Cypher.Variable();
        const node = new Cypher.Node();
        const loadClause = new Cypher.LoadCSV("https://data.neo4j.com/bands/artists.csv", row)
            .withHeaders()
            .merge(
                new Cypher.Pattern(node, {
                    properties: {
                        name: row.property("Name"),
                    },
                })
            )
            .return(row);

        const queryResult = loadClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"LOAD CSV WITH HEADERS FROM \\"https://data.neo4j.com/bands/artists.csv\\" AS var0
MERGE (this1 { name: var0.Name })    
RETURN var0"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
