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

import Cypher from "..";
import { TestClause } from "../utils/TestClause";

describe("Case", () => {
    test("case ... then ... else with comparator", () => {
        const testParam = new Cypher.Param("Hello");

        const caseClause = new Cypher.Case(testParam)
            .when(new Cypher.Literal("Hello"))
            .then(new Cypher.Literal(true))
            .when(new Cypher.Literal("Bye"))
            .then(new Cypher.Literal(false));

        caseClause.else(new Cypher.Literal(false));

        const queryResult = new TestClause(caseClause).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CASE $param0
    WHEN \\"Hello\\" THEN true
    WHEN \\"Bye\\" THEN false
    ELSE false
END"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "Hello",
            }
        `);
    });

    test("generic case ... then ... else without comparator", () => {
        const testParam = new Cypher.Param("Hello");

        const caseClause = new Cypher.Case()
            .when(Cypher.eq(new Cypher.Literal("Hello"), testParam))
            .then(new Cypher.Literal(true));

        caseClause.else(new Cypher.Literal(false));

        const queryResult = new TestClause(caseClause).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CASE
                WHEN \\"Hello\\" = $param0 THEN true
                ELSE false
            END"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "Hello",
            }
        `);
    });

    test("case with missing then fails", () => {
        const testParam = new Cypher.Param("Hello");

        const caseClause = new Cypher.Case().when(Cypher.eq(new Cypher.Literal("Hello"), testParam));

        expect(() => {
            new TestClause(caseClause).build();
        }).toThrow("Cannot generate CASE ... WHEN statement without THEN");
    });

    test("doc example 1", () => {
        const person = new Cypher.Node();
        const matchClause = new Cypher.Match(new Cypher.Pattern(person, { labels: ["Person"] }));

        matchClause.return(
            new Cypher.Case(person.property("eyes"))
                .when(new Cypher.Literal("blue"))
                .then(new Cypher.Literal(1))
                .when(new Cypher.Literal("brown"), new Cypher.Literal("hazel"))
                .then(new Cypher.Literal(2))
                .else(new Cypher.Literal(3))
                .endAs(new Cypher.Variable(), person.property("eyes"))
        );

        const { cypher } = new TestClause(matchClause).build();

        expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Person)
RETURN CASE this0.eyes
    WHEN \\"blue\\" THEN 1
    WHEN \\"brown\\", \\"hazel\\" THEN 2
    ELSE 3
END AS var1, this0.eyes"
`);
    });
});
