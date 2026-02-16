/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";
import { TestClause } from "../../utils/TestClause";

describe("List", () => {
    test("list of Literals", () => {
        const cypherList = new Cypher.List([new Cypher.Literal("1"), new Cypher.Literal("2"), new Cypher.Literal("3")]);

        const queryResult = new TestClause(cypherList).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"[\\"1\\", \\"2\\", \\"3\\"]"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("access list index", () => {
        const cypherList = new Cypher.List([new Cypher.Literal("1"), new Cypher.Literal("2"), new Cypher.Literal("3")]);
        const listIndex = cypherList.index(0);
        const queryResult = new TestClause(listIndex).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"[\\"1\\", \\"2\\", \\"3\\"][0]"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("list range", () => {
        const cypherList = new Cypher.List([new Cypher.Literal("1"), new Cypher.Literal("2"), new Cypher.Literal("3")]);
        const listIndex = cypherList.range(1, -1);
        const queryResult = new TestClause(listIndex).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"[\\"1\\", \\"2\\", \\"3\\"][1..-1]"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
