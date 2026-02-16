/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";

describe("Set", () => {
    test("Set labels", () => {
        const movie = new Cypher.Node();
        const clause = new Cypher.Match(new Cypher.Pattern(movie)).set(movie.label("NewLabel"));

        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
SET
    this0:NewLabel"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Set multiple labels", () => {
        const movie = new Cypher.Node();
        const clause = new Cypher.Match(new Cypher.Pattern(movie)).set(
            movie.label("NewLabel"),
            movie.label("Another Label")
        );

        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
SET
    this0:NewLabel,
    this0:\`Another Label\`"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Set multiple labels of a relationship", () => {
        const movie = new Cypher.Node();
        const actor = new Cypher.Node();
        const clause = new Cypher.Match(new Cypher.Pattern(movie).related().to(actor)).set(
            movie.label("NewLabel"),
            actor.label("Another Label")
        );

        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)-[]->(this1)
SET
    this0:NewLabel,
    this1:\`Another Label\`"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Set dynamic labels", () => {
        const movie = new Cypher.Node();
        const clause = new Cypher.Match(new Cypher.Pattern(movie)).set(
            movie.label(new Cypher.Param("my label")),
            movie.label(movie.property("genre"))
        );

        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
SET
    this0:$($param0),
    this0:$(this0.genre)"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "my label",
}
`);
    });

    test("Set dynamic properties", () => {
        const movie = new Cypher.Node();
        const clause = new Cypher.Match(new Cypher.Pattern(movie)).set([
            movie.property(new Cypher.Param("propName")),
            new Cypher.Param("Value"),
        ]);
        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
SET
    this0[$param0] = $param1"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "propName",
  "param1": "Value",
}
`);
    });

    test("Set node to map", () => {
        const movie = new Cypher.Node();
        const clause = new Cypher.Match(new Cypher.Pattern(movie)).set([
            movie,
            new Cypher.Map({
                title: new Cypher.Param("The Matrix"),
                year: new Cypher.Param(1999),
            }),
        ]);

        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
SET
    this0 = { title: $param0, year: $param1 }"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "The Matrix",
  "param1": 1999,
}
`);
    });

    test("Set node to variable", () => {
        const movie = new Cypher.Node();
        const actor = new Cypher.Node();
        const clause = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["Movie"] }))
            .match(new Cypher.Pattern(actor, { labels: ["Actor"] }))
            .set([movie, actor]);

        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
MATCH (this1:Actor)
SET
    this0 = this1"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Operator += with a map", () => {
        const movie = new Cypher.Node();
        const clause = new Cypher.Match(new Cypher.Pattern(movie)).set([
            movie,
            "+=",
            new Cypher.Map({
                title: new Cypher.Param("The Matrix"),
                year: new Cypher.Param(1999),
            }),
        ]);

        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
SET
    this0 += { title: $param0, year: $param1 }"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "The Matrix",
  "param1": 1999,
}
`);
    });

    test("Operator += with a variable", () => {
        const movie = new Cypher.Node();
        const actor = new Cypher.Node();
        const clause = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["Movie"] }))
            .match(new Cypher.Pattern(actor, { labels: ["Actor"] }))
            .set([movie, "+=", actor]);

        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
MATCH (this1:Actor)
SET
    this0 += this1"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
