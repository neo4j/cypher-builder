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

describe("Predicate Functions", () => {
    test("exists", () => {
        const node = new Cypher.Node();
        const existsFn = Cypher.exists(new Cypher.Pattern(node, { labels: ["Movie"] }));

        const queryResult = new TestClause(existsFn).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"exists((this0:Movie))"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    describe.each(["all", "any", "single", "none"] as const)("%s", (value) => {
        const variable = new Cypher.Variable();
        const exprVariable = new Cypher.Param([1, 2, 5]);
        const filter = Cypher.eq(variable, new Cypher.Literal(5));

        test(value, () => {
            const predicateFn = Cypher[value](variable, exprVariable, filter);
            const queryResult = new TestClause(predicateFn).build();

            expect(queryResult.cypher).toBe(`${value}(var0 IN $param0 WHERE var0 = 5)`);
            expect(queryResult.params).toEqual({
                param0: [1, 2, 5],
            });
        });
    });

    test("isEmpty", () => {
        const isEmpty = Cypher.isEmpty(new Cypher.Literal([]));
        const queryResult = new TestClause(isEmpty).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"isEmpty([])"`);
    });

    test("Using functions as predicates", () => {
        const node = new Cypher.Node();

        const variable = new Cypher.Variable();
        const exprVariable = new Cypher.Param([1, 2, 5]);
        const filter = Cypher.eq(variable, new Cypher.Literal(5));

        const anyFn = Cypher.all(variable, exprVariable, filter);
        const existsFn = Cypher.exists(new Cypher.Pattern(node, { labels: ["Movie"] }));

        const andExpr = Cypher.and(anyFn, existsFn);

        const queryResult = new TestClause(andExpr).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"(all(var0 IN $param0 WHERE var0 = 5) AND exists((this1:Movie)))"`
        );
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
});
