/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../index.js";
import { TestClause } from "../../utils/TestClause.js";

describe("Graph Functions", () => {
    test("graph.names()", () => {
        const labelsFn = Cypher.graph.names();

        const queryResult = new TestClause(labelsFn).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"graph.names()"`);
    });

    test("graph.propertiesByName()", () => {
        const labelsFn = Cypher.graph.propertiesByName(new Cypher.Variable());

        const queryResult = new TestClause(labelsFn).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"graph.propertiesByName(var0)"`);
    });

    test("graph.byName()", () => {
        const labelsFn = Cypher.graph.byName(new Cypher.Variable());

        const queryResult = new TestClause(labelsFn).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"graph.propertiesByName(var0)"`);
    });
});
