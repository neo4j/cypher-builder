/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../src";

describe("Cypher version", () => {
    test("Add cypher version 5 on .build", () => {
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

    test("Add cypher version 25 on .build", () => {
        const movieNode = new Cypher.Node();
        const pattern = new Cypher.Pattern(movieNode, { labels: ["Movie"] });

        const matchQuery = new Cypher.Match(pattern)
            .where(movieNode, {
                title: new Cypher.Param("The Matrix"),
            })
            .return(movieNode.property("title"));

        const { cypher } = matchQuery.build({
            cypherVersion: "25",
        });

        expect(cypher).toMatchInlineSnapshot(`
"CYPHER 25
MATCH (this0:Movie)
WHERE this0.title = $param0
RETURN this0.title"
`);
    });
});
