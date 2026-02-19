/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../index.js";
import { TestClause } from "../utils/TestClause.js";

describe("RelationshipRef", () => {
    test("Create relationships", () => {
        const rel1 = new Cypher.Relationship();
        const rel2 = new Cypher.Relationship();

        const testClause = new TestClause(rel1, rel2);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"this0this1"`);
    });

    test("Create named relationship", () => {
        const rel1 = new Cypher.NamedRelationship("myRel");

        const testClause = new TestClause(rel1);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"myRel"`);
        expect(rel1.name).toBe("myRel");
    });
});
