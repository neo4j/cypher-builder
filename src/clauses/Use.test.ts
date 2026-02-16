/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import * as Cypher from "../Cypher";

describe("CypherBuilder USE", () => {
    test("USE before clause", () => {
        const n1 = new Cypher.Node();
        const query1 = new Cypher.Match(new Cypher.Pattern(n1, { labels: ["Movie"] })).return(n1);

        const useQuery = new Cypher.Use("mydb", query1);
        const queryResult = useQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "USE mydb
            MATCH (this0:Movie)
            RETURN this0"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("USE in CALL", () => {
        const n1 = new Cypher.Node();
        const query1 = new Cypher.Match(new Cypher.Pattern(n1, { labels: ["Movie"] })).return(n1);

        const callQuery = new Cypher.Call(new Cypher.Use("mydb", query1));
        const queryResult = callQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CALL {
                USE mydb
                MATCH (this0:Movie)
                RETURN this0
            }"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("USE in UNION", () => {
        const n1 = new Cypher.Node();
        const query1 = new Cypher.Match(new Cypher.Pattern(n1, { labels: ["Movie"] })).return(n1);
        const n2 = new Cypher.Node();
        const query2 = new Cypher.Match(new Cypher.Pattern(n2, { labels: ["Movie"] })).return(n2);

        const callQuery = new Cypher.Union(new Cypher.Use("mydb", query1), query2);
        const queryResult = callQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "USE mydb
            MATCH (this0:Movie)
            RETURN this0
            UNION
            MATCH (this1:Movie)
            RETURN this1"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
