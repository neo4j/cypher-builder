/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
