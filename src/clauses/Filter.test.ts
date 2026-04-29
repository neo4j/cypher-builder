/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../index";

describe("CypherBuilder Filter", () => {
    test("Standalone Filter", () => {
        const query = new Cypher.Filter(Cypher.true);
        const queryResult = query.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"FILTER true"`);
    });

    test("Match node with filter", () => {
        const node = new Cypher.Node();
        const query = new Cypher.Match(new Cypher.Pattern(node))
            .filter(node.hasLabel("Swedish"))
            .return([node.property("name"), "name"]);

        const queryResult = query.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
FILTER this0:Swedish
RETURN this0.name AS name"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Match node with filter using and", () => {
        const node = new Cypher.Node();
        const query = new Cypher.Match(new Cypher.Pattern(node))
            .filter(node.hasLabel("Swedish"))
            .and(Cypher.eq(node.property("name"), new Cypher.Param("test")))
            .return([node.property("name"), "name"]);

        const queryResult = query.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
FILTER (this0:Swedish AND this0.name = $param0)
RETURN this0.name AS name"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "test",
}
`);
    });

    test("Match node with 2 filter clauses", () => {
        const node = new Cypher.Node();
        const query = new Cypher.Match(new Cypher.Pattern(node))
            .filter(node.hasLabel("Swedish"))
            .filter(Cypher.eq(node.property("name"), new Cypher.Param("test")))
            .return([node.property("name"), "name"]);

        const queryResult = query.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
FILTER this0:Swedish
FILTER this0.name = $param0
RETURN this0.name AS name"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "test",
}
`);
    });

    test("Filter with empty predicate doesn't generate clause", () => {
        const query = new Cypher.Filter(new Cypher.Raw("")).return("*");
        const queryResult = query.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"
RETURN *"
`);
    });
});
