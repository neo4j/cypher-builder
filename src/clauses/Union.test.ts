/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import * as Cypher from "../Cypher";

describe("CypherBuilder UNION", () => {
    test("Union Movies", () => {
        const returnVar = new Cypher.Variable();
        const n1 = new Cypher.Node();
        const query1 = new Cypher.Match(new Cypher.Pattern(n1, { labels: ["Movie"] })).return([n1, returnVar]);
        const n2 = new Cypher.Node();
        const query2 = new Cypher.Match(new Cypher.Pattern(n2, { labels: ["Movie"] })).return([n2, returnVar]);
        const n3 = new Cypher.Node();
        const query3 = new Cypher.Match(new Cypher.Pattern(n3, { labels: ["Movie"] })).return([n3, returnVar]);

        const unionQuery = new Cypher.Union(query1, query2, query3);
        const queryResult = unionQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            RETURN this0 AS var1
            UNION
            MATCH (this2:Movie)
            RETURN this2 AS var1
            UNION
            MATCH (this3:Movie)
            RETURN this3 AS var1"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Union ALL Movies", () => {
        const returnVar = new Cypher.Variable();
        const n1 = new Cypher.Node();
        const query1 = new Cypher.Match(new Cypher.Pattern(n1, { labels: ["Movie"] })).return([n1, returnVar]);
        const n2 = new Cypher.Node();
        const query2 = new Cypher.Match(new Cypher.Pattern(n2, { labels: ["Movie"] })).return([n2, returnVar]);
        const n3 = new Cypher.Node();
        const query3 = new Cypher.Match(new Cypher.Pattern(n3, { labels: ["Movie"] })).return([n3, returnVar]);

        const unionQuery = new Cypher.Union(query1, query2, query3).all();
        const queryResult = unionQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            RETURN this0 AS var1
            UNION ALL
            MATCH (this2:Movie)
            RETURN this2 AS var1
            UNION ALL
            MATCH (this3:Movie)
            RETURN this3 AS var1"
        `);
    });

    test("Union DISTINCT Movies", () => {
        const returnVar = new Cypher.Variable();
        const n1 = new Cypher.Node();
        const query1 = new Cypher.Match(new Cypher.Pattern(n1, { labels: ["Movie"] })).return([n1, returnVar]);
        const n2 = new Cypher.Node();
        const query2 = new Cypher.Match(new Cypher.Pattern(n2, { labels: ["Movie"] })).return([n2, returnVar]);
        const n3 = new Cypher.Node();
        const query3 = new Cypher.Match(new Cypher.Pattern(n3, { labels: ["Movie"] })).return([n3, returnVar]);

        const unionQuery = new Cypher.Union(query1, query2, query3).distinct();
        const queryResult = unionQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            RETURN this0 AS var1
            UNION DISTINCT
            MATCH (this2:Movie)
            RETURN this2 AS var1
            UNION DISTINCT
            MATCH (this3:Movie)
            RETURN this3 AS var1"
        `);
    });
});
