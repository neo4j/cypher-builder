/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import * as Cypher from "../../src";
import { TestClause } from "../../src/utils/TestClause";

describe("https://github.com/neo4j/cypher-builder/pull/547", () => {
    test("escaped reserved var name IN in case ... then using index", () => {
        const testParam = new Cypher.Param("Hello");
        const reserveVar = new Cypher.NamedVariable("in");

        const caseClause = new Cypher.Case(testParam).when(reserveVar.index(1)).then(new Cypher.Literal(true));

        const queryResult = new TestClause(caseClause).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CASE $param0
  WHEN \`in\`[1] THEN true
END"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "Hello",
            }
        `);
    });

    test("escaped reserved var name IN in case ... then using property", () => {
        const testParam = new Cypher.Param("Hello");
        const reserveVar = new Cypher.NamedVariable("in");

        const caseClause = new Cypher.Case(testParam).when(reserveVar.property("a")).then(new Cypher.Literal(true));

        const queryResult = new TestClause(caseClause).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CASE $param0
  WHEN \`in\`.a THEN true
END"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "Hello",
            }
        `);
    });
});
