/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "..";

describe("CypherBuilder Finish", () => {
    test("Finish Clause", () => {
        const finishQuery = new Cypher.Finish();

        const queryResult = finishQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"FINISH"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Create.withFinish", () => {
        const node = new Cypher.Node();

        const createQuery = new Cypher.Create(new Cypher.Pattern(new Cypher.Node()))
            .set([node.property("test"), new Cypher.Param("Hello World")])
            .finish();

        const queryResult = createQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CREATE (this0)
SET this1.test = $param0
FINISH"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "Hello World",
}
`);
    });

    test("Match.withFinish", () => {
        const createQuery = new Cypher.Match(new Cypher.Pattern(new Cypher.Node())).finish();

        const queryResult = createQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
FINISH"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
