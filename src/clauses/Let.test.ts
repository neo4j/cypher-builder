/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import * as Cypher from "../Cypher.js";

describe("CypherBuilder Let", () => {
    test("Standalone Let clause", () => {
        const variable = new Cypher.Variable();
        const letQuery = new Cypher.Let([variable, new Cypher.Literal(42)]);
        const queryResult = letQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"LET var0 = 42"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Let with single binding", () => {
        const node = new Cypher.Node();
        const fullName = new Cypher.Variable();

        const letQuery = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Customer"] }))
            .let([
                fullName,
                Cypher.plus(node.property("firstName"), new Cypher.Literal(" "), node.property("lastName")),
            ])
            .return(fullName);

        const queryResult = letQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
          "MATCH (this0:Customer)
          LET var1 = (this0.firstName + ' ' + this0.lastName)
          RETURN var1"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Let with multiple bindings in a single clause", () => {
        const node = new Cypher.Node();
        const supplier = new Cypher.Variable();
        const product = new Cypher.Variable();

        const letQuery = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Supplier"] })).let(
            [supplier, node.property("name")],
            [product, new Cypher.Literal("unknown")]
        );

        const queryResult = letQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Supplier)
LET var1 = this0.name, var2 = 'unknown'"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Chained Let clauses", () => {
        const node = new Cypher.Node();
        const isExpensive = new Cypher.Variable();
        const isAffordable = new Cypher.Variable();

        const matchQuery = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Product"] }));
        const firstLet = matchQuery.let([isExpensive, Cypher.gte(node.property("price"), new Cypher.Literal(500))]);
        firstLet.let([isAffordable, isExpensive]);

        const queryResult = matchQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
          "MATCH (this0:Product)
          LET var1 = this0.price >= 500
          LET var2 = var1"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Let followed by With", () => {
        const node = new Cypher.Node();
        const effectivePrice = new Cypher.Variable();

        const matchQuery = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Product"] }));
        matchQuery
            .let([effectivePrice, Cypher.multiply(node.property("price"), new Cypher.Literal(0.9))])
            .with(node, effectivePrice);

        const queryResult = matchQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Product)
LET var1 = (this0.price * 0.9)
WITH this0, var1"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Let with a pre-built Let instance", () => {
        const node = new Cypher.Node();
        const a = new Cypher.Variable();
        const b = new Cypher.Variable();
        const secondLet = new Cypher.Let([b, a]);
        const matchQuery = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Product"] }));
        matchQuery.let([a, Cypher.gte(node.property("price"), new Cypher.Literal(100))]).let(secondLet);
        const queryResult = matchQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Product)
LET var1 = this0.price >= 100
LET var2 = var1"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Fails to chain let if there is an existing chained clause", () => {
        const variable = new Cypher.Variable();
        const letQuery = new Cypher.Let([variable, new Cypher.Literal(1)]);

        letQuery.return(variable);

        expect(() => {
            letQuery.let([new Cypher.Variable(), new Cypher.Literal(2)]);
        }).toThrow("Cannot add <Clause Let> to <Clause Let> because Let it is not the last clause.");
    });
});
