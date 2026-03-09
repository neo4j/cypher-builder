/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../index.js";

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
