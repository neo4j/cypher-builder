/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";
import { TestClause } from "../../utils/TestClause";

describe("Cypher Functions", () => {
    test("custom function", () => {
        const myFunction = new Cypher.Function("myFunction", [new Cypher.Literal("test"), new Cypher.Param("test2")]);
        const queryResult = new TestClause(myFunction).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"myFunction('test', $param0)"`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "test2",
            }
        `);
    });
});
