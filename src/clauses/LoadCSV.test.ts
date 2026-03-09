/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../index.js";

describe("LoadCSV", () => {
    test("Simple LoadCSV", () => {
        const row = new Cypher.Variable();
        const loadClause = new Cypher.LoadCSV("https://data.neo4j.com/bands/artists.csv", row).return(row);

        const queryResult = loadClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
          "LOAD CSV FROM "https://data.neo4j.com/bands/artists.csv" AS var0
          RETURN var0"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("LoadCSV with headers", () => {
        const row = new Cypher.Variable();
        const node = new Cypher.Node();
        const loadClause = new Cypher.LoadCSV("https://data.neo4j.com/bands/artists.csv", row)
            .withHeaders()
            .merge(
                new Cypher.Pattern(node, {
                    properties: {
                        name: row.property("Name"),
                    },
                })
            )
            .return(row);

        const queryResult = loadClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
          "LOAD CSV WITH HEADERS FROM "https://data.neo4j.com/bands/artists.csv" AS var0
          MERGE (this1 { name: var0.Name })    
          RETURN var0"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
