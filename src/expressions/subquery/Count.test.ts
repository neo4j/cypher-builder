/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../index.js";

describe("Count Subquery", () => {
    test("Count predicate with subclause", () => {
        const subquery = new Cypher.Match(new Cypher.Pattern(new Cypher.Node(), { labels: ["Movie"] })).return("*");

        const countExpr = new Cypher.Count(subquery);
        const match = new Cypher.Match(new Cypher.Pattern(new Cypher.Node()))
            .where(Cypher.gt(countExpr, new Cypher.Literal(10)))
            .return("*");

        const queryResult = match.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
WHERE COUNT {
  MATCH (this1:Movie)
  RETURN *
} > 10
RETURN *"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Simple Count subquery", () => {
        const countExpr = new Cypher.Count(new Cypher.Pattern(new Cypher.Node(), { labels: ["Movie"] }));
        const match = new Cypher.Match(new Cypher.Pattern(new Cypher.Node()))
            .where(Cypher.gt(countExpr, new Cypher.Literal(10)))
            .return("*");

        const queryResult = match.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
WHERE COUNT {
  (this1:Movie)
} > 10
RETURN *"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
