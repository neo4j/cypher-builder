/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../index.js";
import { TestClause } from "../utils/TestClause.js";

describe("NodeRef", () => {
    test("Create node", () => {
        const node1 = new Cypher.Node();
        const node2 = new Cypher.Node();

        const testClause = new TestClause(node1, node2);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"this0this1"`);
    });

    test("Create named node", () => {
        const node1 = new Cypher.NamedNode("myNode");

        const testClause = new TestClause(node1);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"myNode"`);
        expect(node1.name).toBe("myNode");
    });
});
