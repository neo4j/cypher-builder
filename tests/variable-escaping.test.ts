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

import Cypher from "../src";

describe("Variable escaping", () => {
    test("Should escape NamedNode", () => {
        const movie = new Cypher.NamedNode("n v");
        const match = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["My Movie"] })).return(movie);

        const { cypher, params } = match.build();

        expect(cypher).toMatchInlineSnapshot(`
            "MATCH (\`n v\`:\`My Movie\`)
            RETURN \`n v\`"
        `);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Should escape NamedRelationship", () => {
        const movie = new Cypher.Node();
        const relationship = new Cypher.NamedRelationship("my `rel");
        const match = new Cypher.Match(
            new Cypher.Pattern(movie, { labels: ["Movie"] }).related(relationship, { type: "Movie" }).to()
        ).return(relationship);

        const { cypher, params } = match.build();
        expect(cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)-[\`my \`\`rel\`:Movie]->(this1)
            RETURN \`my \`\`rel\`"
        `);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Should escape NamedVariable", () => {
        const variable = new Cypher.NamedVariable("my var");
        const movie = new Cypher.NamedNode("n v");
        const match = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["My Movie"] })).return(variable);

        const { cypher, params } = match.build();

        expect(cypher).toMatchInlineSnapshot(`
            "MATCH (\`n v\`:\`My Movie\`)
            RETURN \`my var\`"
        `);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Should escape prefix", () => {
        const movie = new Cypher.Node();
        const match = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["My Movie"] })).return(movie);

        const { cypher, params } = match.build("my prefix");

        expect(cypher).toMatchInlineSnapshot(`
            "MATCH (\`my prefixthis0\`:\`My Movie\`)
            RETURN \`my prefixthis0\`"
        `);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Should escape path", () => {
        const movie = new Cypher.Node();
        const relationship = new Cypher.Relationship();
        const match = new Cypher.Match(
            new Cypher.Pattern(movie, { labels: ["Movie"] }).related(relationship, { type: "Movie" }).to()
        )
            .assignToPath(new Cypher.NamedPath("my path"))
            .return(relationship);

        const { cypher, params } = match.build();
        expect(cypher).toMatchInlineSnapshot(`
            "MATCH \`my path\` = (this0:Movie)-[this1:Movie]->(this2)
            RETURN this1"
        `);
        expect(params).toMatchInlineSnapshot(`{}`);
    });
});
