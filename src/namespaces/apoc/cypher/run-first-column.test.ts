/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../..";
import { TestClause } from "../../../utils/TestClause";

describe("apoc.cypher", () => {
    test("runFirstColumnSingle", () => {
        const node = new Cypher.Node();
        const subquery = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).return(node);

        const apocRunFirstColum = Cypher.apoc.cypher.runFirstColumnSingle(subquery);
        const queryResult = new TestClause(apocRunFirstColum).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "apoc.cypher.runFirstColumnSingle(\\"MATCH (this0:Movie)
            RETURN this0\\", {  })"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("runFirstColumnSingle with parameters", () => {
        const node = new Cypher.Node();
        const subquery = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).return(node);

        const apocRunFirstColum = Cypher.apoc.cypher.runFirstColumnSingle(subquery, [node]);
        const queryResult = new TestClause(apocRunFirstColum).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "apoc.cypher.runFirstColumnSingle(\\"MATCH (this0:Movie)
            RETURN this0\\", { this0: this0 })"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("runFirstColumnMany", () => {
        const node = new Cypher.Node();
        const subquery = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).return(node);

        const apocRunFirstColum = Cypher.apoc.cypher.runFirstColumnMany(subquery);
        const queryResult = new TestClause(apocRunFirstColum).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "apoc.cypher.runFirstColumnMany(\\"MATCH (this0:Movie)
            RETURN this0\\", {  })"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("runFirstColumnMany with parameters", () => {
        const node = new Cypher.Node();
        const subquery = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).return(node);

        const apocRunFirstColum = Cypher.apoc.cypher.runFirstColumnMany(subquery, [node]);
        const queryResult = new TestClause(apocRunFirstColum).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "apoc.cypher.runFirstColumnMany(\\"MATCH (this0:Movie)
            RETURN this0\\", { this0: this0 })"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("runFirstColumn with string", () => {
        const node = new Cypher.Node();
        const subquery = "MATCH (n:Film) RETURN n";

        const apocRunFirstColum = Cypher.apoc.cypher.runFirstColumnSingle(subquery, [node]);
        const queryResult = new TestClause(apocRunFirstColum).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"apoc.cypher.runFirstColumnSingle(\\"MATCH (n:Film) RETURN n\\", { this0: this0 })"`
        );

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("runFirstColumn with a map for parameters", () => {
        const node = new Cypher.Node();
        const subquery = "MATCH (n) RETURN n";

        const params = new Cypher.Map({
            n: node,
            param: new Cypher.Param("Test param"),
        });

        const apocRunFirstColum = Cypher.apoc.cypher.runFirstColumnSingle(subquery, params);
        const queryResult = new TestClause(apocRunFirstColum).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"apoc.cypher.runFirstColumnSingle(\\"MATCH (n) RETURN n\\", { n: this0, param: $param0 })"`
        );

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "Test param",
            }
        `);
    });

    test("Complex subquery with scoped env and params", () => {
        const node = new Cypher.Node();
        const param1 = new Cypher.Param("The Matrix");

        const topQuery = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).where(
            Cypher.eq(node.property("title"), param1)
        );

        const nestedPattern = new Cypher.Pattern(node);
        const releasedParam = new Cypher.Param(1999);
        const subQuery = new Cypher.Match(nestedPattern).set([node.property("released"), releasedParam]).return(node);
        const apocCall = Cypher.apoc.cypher.runFirstColumnMany(subQuery, [node, releasedParam]);

        topQuery.return(
            new Cypher.Map({
                result: apocCall,
            })
        );

        const cypherResult = topQuery.build();

        expect(cypherResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            WHERE this0.title = $param0
            RETURN { result: apoc.cypher.runFirstColumnMany(\\"MATCH (this0)
            SET
                this0.released = $param1
            RETURN this0\\", { this0: this0, param1: $param1 }) }"
        `);
        expect(cypherResult.params).toMatchInlineSnapshot(`
            {
              "param0": "The Matrix",
              "param1": 1999,
            }
        `);
    });

    test("runFirstColumn with an object for parameters", () => {
        const node = new Cypher.Node();
        const subquery = "MATCH (n) RETURN n";

        const params = {
            n: node,
            param: new Cypher.Param("Test param"),
        };

        const apocRunFirstColum = Cypher.apoc.cypher.runFirstColumnSingle(subquery, params);
        const queryResult = new TestClause(apocRunFirstColum).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"apoc.cypher.runFirstColumnSingle(\\"MATCH (n) RETURN n\\", { n: this0, param: $param0 })"`
        );

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "Test param",
            }
        `);
    });

    test("runFirstColumnSingle", () => {
        const node = new Cypher.Node();

        const nestedSubquery = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).return(node);
        const nestedRunFirstColumn = Cypher.apoc.cypher.runFirstColumnSingle(nestedSubquery);

        const subquery = new Cypher.Return([nestedRunFirstColumn, "result"]);

        const apocRunFirstColum = Cypher.apoc.cypher.runFirstColumnSingle(subquery);
        const queryResult = new TestClause(apocRunFirstColum).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "apoc.cypher.runFirstColumnSingle(\\"RETURN apoc.cypher.runFirstColumnSingle(\\\\\\"MATCH (this0:Movie)
            RETURN this0\\\\\\", {  }) AS result\\", {  })"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
