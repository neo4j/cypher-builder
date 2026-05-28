/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import * as Cypher from "../Cypher";

describe("CypherBuilder NEXT", () => {
    test("next() with chained match", () => {
        const customer = new Cypher.Variable();
        const c = new Cypher.Node();
        const c2 = new Cypher.Node();

        const query = new Cypher.Match(new Cypher.Pattern(c, { labels: ["Customer"] }))
            .return([c, customer])
            .next()
            .match(new Cypher.Pattern(c2, { labels: ["Product"] }))
            .return(c2);

        const { cypher } = query.build();
        expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Customer)
RETURN this0 AS var1
NEXT
MATCH (this2:Product)
RETURN this2"
`);
    });

    test("next(clause) with existing Match instance", () => {
        const customer = new Cypher.Variable();
        const c = new Cypher.Node();
        const c2 = new Cypher.Node();

        const secondMatch = new Cypher.Match(new Cypher.Pattern(c2, { labels: ["Product"] }));

        const returnedClause = new Cypher.Match(new Cypher.Pattern(c, { labels: ["Customer"] }))
            .return([c, customer])
            .next(secondMatch);

        expect(returnedClause).toBe(secondMatch);

        returnedClause.return(c2);

        const { cypher } = returnedClause.build();
        expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Customer)
RETURN this0 AS var1
NEXT
MATCH (this2:Product)
RETURN this2"
`);
    });

    test("multiple NEXT chaining", () => {
        const a = new Cypher.Node();
        const b = new Cypher.Node();
        const c = new Cypher.Node();

        const query = new Cypher.Match(new Cypher.Pattern(a, { labels: ["A"] }))
            .return(a)
            .next()
            .match(new Cypher.Pattern(b, { labels: ["B"] }))
            .return(b)
            .next()
            .return(c);

        const { cypher } = query.build();
        expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:A)
RETURN this0
NEXT
MATCH (this1:B)
RETURN this1
NEXT
RETURN this2"
`);
    });

    test("standalone Next clause", () => {
        const n = new Cypher.Node();
        const query = new Cypher.Next().return(n);

        const { cypher } = query.build();
        expect(cypher).toMatchInlineSnapshot(`
"NEXT
RETURN this0"
`);
    });

    test("FINISH followed by NEXT", () => {
        const n = new Cypher.Node();

        const query = new Cypher.Create(new Cypher.Pattern(n, { labels: ["Movie"] }))
            .finish()
            .next()
            .match(new Cypher.Pattern(n, { labels: ["Movie"] }))
            .return(n);

        const { cypher } = query.build();
        expect(cypher).toMatchInlineSnapshot(`
"CREATE (this0:Movie)
FINISH
NEXT
MATCH (this0:Movie)
RETURN this0"
`);
    });
});
