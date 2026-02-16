/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";

describe("QuantifiedPath", () => {
    test("Match quantified path", () => {
        const m = new Cypher.Node();
        const m2 = new Cypher.Node();

        const quantifiedPath = new Cypher.QuantifiedPath(
            new Cypher.Pattern(m, { labels: ["Movie"], properties: { title: new Cypher.Param("V for Vendetta") } }),
            new Cypher.Pattern({ labels: ["Movie"] })
                .related({ type: "ACTED_IN" })
                .to({ labels: ["Person"] })
                .quantifier({ min: 1, max: 2 }),
            new Cypher.Pattern(m2, {
                labels: ["Movie"],
                properties: { title: new Cypher.Param("Something's Gotta Give") },
            })
        );

        const query = new Cypher.Match(quantifiedPath).return(m2);
        const queryResult = query.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie { title: $param0 })
      ((:Movie)-[:ACTED_IN]->(:Person)){1,2}
      (this1:Movie { title: $param1 })
RETURN this1"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "V for Vendetta",
  "param1": "Something's Gotta Give",
}
`);
    });

    test("Match and assign quantified path", () => {
        const m = new Cypher.Node();
        const m2 = new Cypher.Node();
        const p = new Cypher.PathVariable();

        const quantifiedPath = new Cypher.QuantifiedPath(
            new Cypher.Pattern(m, { labels: ["Movie"], properties: { title: new Cypher.Param("V for Vendetta") } }),
            new Cypher.Pattern({ labels: ["Movie"] })
                .related({ type: "ACTED_IN" })
                .to({ labels: ["Person"] })
                .quantifier({ min: 1, max: 2 }),
            new Cypher.Pattern(m2, {
                labels: ["Movie"],
                properties: { title: new Cypher.Param("Something's Gotta Give") },
            })
        );

        const query = new Cypher.Match(quantifiedPath.assignTo(p)).return(p);
        const queryResult = query.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH p2 = (this0:Movie { title: $param0 })
      ((:Movie)-[:ACTED_IN]->(:Person)){1,2}
      (this1:Movie { title: $param1 })
RETURN p2"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "V for Vendetta",
  "param1": "Something's Gotta Give",
}
`);
    });

    test("Match quantified path with a single pattern", () => {
        const m = new Cypher.Node();
        const m2 = new Cypher.Node();

        const quantifiedPath = new Cypher.QuantifiedPath(
            new Cypher.Pattern(m, { labels: ["Movie"] })
                .related({ type: "ACTED_IN" })
                .to({ labels: ["Person"] })
                .quantifier({ min: 1, max: 2 })
        );

        const query = new Cypher.Match(quantifiedPath).return(m2);
        const queryResult = query.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH ((this0:Movie)-[:ACTED_IN]->(:Person)){1,2}
RETURN this1"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Match quantified path without parameters", () => {
        const m2 = new Cypher.Node();

        const quantifiedPath = new Cypher.QuantifiedPath();

        const query = new Cypher.Match(quantifiedPath).return(m2);
        const queryResult = query.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH 
RETURN this0"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
