/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";

describe("Exists subquery", () => {
    test("Exists predicate with subclause", () => {
        const subquery = new Cypher.Match(new Cypher.Pattern(new Cypher.Node(), { labels: ["Movie"] })).return("*");

        const existsExpression = new Cypher.Exists(subquery);
        const match = new Cypher.Match(new Cypher.Pattern(new Cypher.Node())).where(existsExpression).return("*");

        const queryResult = match.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0)
            WHERE EXISTS {
                MATCH (this1:Movie)
                RETURN *
            }
            RETURN *"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Simple exists subquery", () => {
        const subquery = new Cypher.Pattern(new Cypher.Node(), { labels: ["Movie"] });

        const existsExpression = new Cypher.Exists(subquery);
        const match = new Cypher.Match(new Cypher.Pattern(new Cypher.Node())).where(existsExpression).return("*");

        const queryResult = match.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
WHERE EXISTS {
    (this1:Movie)
}
RETURN *"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
