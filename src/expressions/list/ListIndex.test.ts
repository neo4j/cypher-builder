/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";
import { TestClause } from "../../utils/TestClause";

describe("ListIndex", () => {
    test("get 0 from list", () => {
        const list = new Cypher.List([new Cypher.Literal("1"), new Cypher.Literal("2"), new Cypher.Literal("3")]);
        const listIndex = Cypher.listIndex(list, 0);
        const queryResult = new TestClause(listIndex).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"['1', '2', '3'][0]"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("get index from arbitrary expression", () => {
        const collect = Cypher.collect(new Cypher.Variable());
        const listIndex = Cypher.listIndex(collect, 2);
        const queryResult = new TestClause(listIndex).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"collect(var0)[2]"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
