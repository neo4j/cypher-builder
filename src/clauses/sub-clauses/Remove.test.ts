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

import Cypher from "../..";

describe("Remove", () => {
    test("Remove labels", () => {
        const movie = new Cypher.Node();
        const clause = new Cypher.Match(new Cypher.Pattern(movie)).remove(movie.label("NewLabel"));

        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
REMOVE this0:NewLabel"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Remove multiple labels of a relationship", () => {
        const movie = new Cypher.Node();
        const actor = new Cypher.Node();
        const clause = new Cypher.Match(new Cypher.Pattern(movie).related().to(actor)).remove(
            movie.label("NewLabel"),
            actor.label("Another Label")
        );

        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)-[]->(this1)
REMOVE this0:NewLabel, this1:\`Another Label\`"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Remove dynamic labels", () => {
        const movie = new Cypher.Node();
        const clause = new Cypher.Match(new Cypher.Pattern(movie)).remove(movie.label(Cypher.labels(movie)));

        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
REMOVE this0:$(labels(this0))"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
