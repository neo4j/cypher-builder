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

import Cypher from "../..";
import { TestClause } from "../../utils/TestClause";

describe("List comprehension", () => {
    test("comprehension without filter", () => {
        const variable = new Cypher.Variable();
        const exprVariable = new Cypher.Param([1, 2, 5]);

        const listComprehension = new Cypher.ListComprehension(variable, exprVariable);

        const queryResult = new TestClause(listComprehension).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"[var0 IN $param0]"`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": [
                1,
                2,
                5,
              ],
            }
        `);
    });

    test("comprehension with filter", () => {
        const variable = new Cypher.Variable();
        const exprVariable = new Cypher.Param([1, 2, 5]);
        const andExpr = Cypher.eq(variable, new Cypher.Param(5));

        const listComprehension = new Cypher.ListComprehension(variable, exprVariable).where(andExpr);

        const queryResult = new TestClause(listComprehension).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"[var0 IN $param1 WHERE var0 = $param0]"`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 5,
              "param1": [
                1,
                2,
                5,
              ],
            }
        `);
    });

    test("comprehension with expression and map using building methods", () => {
        const variable = new Cypher.Variable();
        const exprVariable = new Cypher.Param([1, 2, 5]);
        const andExpr = Cypher.eq(variable, new Cypher.Param(5));

        const listComprehension = new Cypher.ListComprehension(variable)
            .in(exprVariable)
            .where(andExpr)
            .map(Cypher.plus(variable, new Cypher.Literal(1)));

        const queryResult = new TestClause(listComprehension).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"[var0 IN $param1 WHERE var0 = $param0 | (var0 + 1)]"`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 5,
              "param1": [
                1,
                2,
                5,
              ],
            }
        `);
    });

    it("Fails to set a expression twice", () => {
        const variable = new Cypher.Variable();
        const exprVariable = new Cypher.Param([1, 2, 5]);

        expect(() => {
            new Cypher.ListComprehension(variable, exprVariable).in(exprVariable);
        }).toThrowError("Cannot set 2 lists in list comprehension IN");
    });

    it("Fails to build if no expression is set", () => {
        const variable = new Cypher.Variable();

        const listComprehension = new Cypher.ListComprehension(variable);
        expect(() => {
            new TestClause(listComprehension).build();
        }).toThrowError("List Comprehension needs a source list after IN");
    });
});
