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

describe("boolean operations", () => {
    const predicate1 = Cypher.coalesce(new Cypher.Variable());
    const predicate2 = Cypher.max(new Cypher.Variable());
    const predicate3 = Cypher.min(new Cypher.Variable());

    describe.each([
        { func: "and", operator: "AND" },
        { func: "or", operator: "OR" },
        { func: "xor", operator: "XOR" },
    ] as const)("$func", ({ func, operator }) => {
        test("operation with 2 predicates", () => {
            const booleanFunc = Cypher[func](predicate1, predicate2);
            const { cypher } = new TestClause(booleanFunc).build();
            expect(cypher).toBe(`(coalesce(var0) ${operator} max(var1))`);
        });

        test("operation with single predicate", () => {
            const booleanFunc = Cypher[func](predicate1);
            const { cypher } = new TestClause(booleanFunc).build();
            expect(cypher).toBe(`coalesce(var0)`);
        });

        test("operation with three predicates", () => {
            const booleanFunc = Cypher[func](predicate1, predicate2, predicate3);
            const { cypher } = new TestClause(booleanFunc).build();
            expect(cypher).toBe(`(coalesce(var0) ${operator} max(var1) ${operator} min(var2))`);
        });

        test("operation without parameters", () => {
            const booleanFunc = Cypher[func]();
            const { cypher } = new TestClause(booleanFunc).build();
            expect(cypher).toBe("");
        });

        test("operation with undefined", () => {
            const booleanFunc = Cypher[func](undefined, undefined);
            const { cypher } = new TestClause(booleanFunc).build();
            expect(cypher).toBe("");
        });

        test("nested boolean operation", () => {
            const booleanFunc = Cypher[func](Cypher[func](predicate1, predicate2), predicate3);
            const { cypher } = new TestClause(booleanFunc).build();
            expect(cypher).toBe(`((coalesce(var0) ${operator} max(var1)) ${operator} min(var2))`);
        });

        test("nested boolean operation with undefined", () => {
            const booleanFunc = Cypher[func](Cypher[func](), predicate2);
            const { cypher } = new TestClause(booleanFunc).build();
            expect(cypher).toBe(`max(var0)`);
        });
    });
    describe("not", () => {
        test("not operation with simple predicate", () => {
            const not = Cypher.not(predicate1);
            const { cypher } = new TestClause(not).build();
            expect(cypher).toMatchInlineSnapshot(`"NOT (coalesce(var0))"`);
        });
        test("nested not operation with single predicates", () => {
            const yes = Cypher.not(Cypher.not(predicate1));
            const { cypher } = new TestClause(yes).build();
            expect(cypher).toMatchInlineSnapshot(`"NOT (NOT (coalesce(var0)))"`);
        });
    });
});
