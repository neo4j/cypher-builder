/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
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
"MATCH (this0:Movie)-[\`my \`\`rel\`:Movie]->()
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

        const { cypher, params } = match.build({ prefix: "my prefix" });

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
            new Cypher.Pattern(movie, { labels: ["Movie"] })
                .related(relationship, { type: "Movie" })
                .to()
                .assignTo(new Cypher.NamedPathVariable("my path"))
        ).return(relationship);

        const { cypher, params } = match.build();
        expect(cypher).toMatchInlineSnapshot(`
"MATCH \`my path\` = (this0:Movie)-[this1:Movie]->()
RETURN this1"
`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });
});
