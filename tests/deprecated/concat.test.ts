/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../src";

describe("CypherBuilder utils.concat", () => {
    test("concatenates Match and Return", () => {
        const node = new Cypher.Node();

        const clause = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).where(
            Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb"))
        );
        const returnClause = new Cypher.Return([node.property("title"), "movie"]);

        const query = Cypher.utils.concat(clause, returnClause);

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            WHERE $param0 = $param1
            RETURN this0.title AS movie"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "aa",
              "param1": "bb",
            }
        `);
        expect(query.children).toHaveLength(2);
    });

    test("Empty composite clause", () => {
        const compositeClause = Cypher.utils.concat(undefined);
        expect(compositeClause.empty).toBeTrue();
        expect(compositeClause.children).toHaveLength(0);

        const queryResult = compositeClause.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`""`);
    });

    test("Empty nested composite clause", () => {
        const compositeClause = Cypher.utils.concat(Cypher.utils.concat());
        expect(compositeClause.empty).toBeTrue();
        expect(compositeClause.children).toHaveLength(0);

        const queryResult = compositeClause.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`""`);
    });

    test("Nested composite clause with multiple elements", () => {
        const compositeClause = Cypher.utils.concat(
            Cypher.utils.concat(
                new Cypher.Match(new Cypher.Pattern(new Cypher.Node())),
                new Cypher.Match(new Cypher.Pattern(new Cypher.Node()))
            )
        );
        expect(compositeClause.empty).toBeFalse();
        expect(compositeClause.children).toHaveLength(1);

        const queryResult = compositeClause.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0)
            MATCH (this1)"
        `);
    });

    test("Non-Empty composite clause", () => {
        const node = new Cypher.Node();

        const clause = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).where(
            Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb"))
        );
        const compositeClause = Cypher.utils.concat(clause);
        expect(compositeClause.empty).toBeFalse();
        expect(compositeClause.children).toHaveLength(1);
    });

    test("Nested concatenation flattens the tree if composite clause has 1 element", () => {
        const node = new Cypher.Node();

        const clause = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).where(
            Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb"))
        );
        const returnClause = new Cypher.Return([node.property("title"), "movie"]);

        const nestedConcat = Cypher.utils.concat(clause);

        const topLevelConcat = Cypher.utils.concat(nestedConcat, returnClause);

        const queryResult = topLevelConcat.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            WHERE $param0 = $param1
            RETURN this0.title AS movie"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "aa",
              "param1": "bb",
            }
        `);

        // Three children as nested concat was flattened
        expect(topLevelConcat.children).toHaveLength(2);
    });
});
