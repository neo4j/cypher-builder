/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../index.js";
import { TestClause } from "../../utils/TestClause.js";

describe("Path Functions", () => {
    test("nodes", () => {
        const nodesFn = Cypher.nodes(new Cypher.PathVariable());

        const queryResult = new TestClause(nodesFn).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"nodes(p0)"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("relationships", () => {
        const relationshipsFn = Cypher.relationships(new Cypher.PathVariable());

        const queryResult = new TestClause(relationshipsFn).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"relationships(p0)"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("NamedPath", () => {
        const nodesFn = Cypher.nodes(new Cypher.NamedPathVariable("my_path"));

        const queryResult = new TestClause(nodesFn).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"nodes(my_path)"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
