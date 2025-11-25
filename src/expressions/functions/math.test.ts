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

describe("Math Functions", () => {
    // Functions with no argument
    test.each(["rand", "e", "pi"] as const)("%s()", (value) => {
        const mathFunc = Cypher[value]();
        const { cypher } = new TestClause(mathFunc).build();

        expect(cypher).toBe(`${value}()`);
    });
    // Functions with 1 argument
    test.each([
        "abs",
        "ceil",
        "floor",
        "isNaN",
        "sign",
        "exp",
        "log",
        "log10",
        "sqrt",
        "acos",
        "asin",
        "atan",
        "atan2",
        "cos",
        "cot",
        "degrees",
        "haversin",
        "radians",
        "sin",
        "tan",
    ] as const)("%s()", (value) => {
        const mathFunc = Cypher[value](new Cypher.Literal(10));
        const { cypher } = new TestClause(mathFunc).build();

        expect(cypher).toBe(`${value}(10)`);
    });

    describe("round()", () => {
        const roundNumber = new Cypher.Literal(10.23);

        test("round() with a single expression", () => {
            const roundFunc = Cypher.round(roundNumber);
            const { cypher } = new TestClause(roundFunc).build();

            expect(cypher).toBe(`round(10.23)`);
        });

        test("round() with precision number", () => {
            const roundFunc = Cypher.round(roundNumber, 4);
            const { cypher } = new TestClause(roundFunc).build();

            expect(cypher).toBe(`round(10.23, 4)`);
        });

        test("round() with precision expression", () => {
            const roundFunc = Cypher.round(roundNumber, new Cypher.Literal(3));
            const { cypher } = new TestClause(roundFunc).build();

            expect(cypher).toBe(`round(10.23, 3)`);
        });

        test("round() with precision mode", () => {
            const roundFunc = Cypher.round(roundNumber, 3, "HALF_DOWN");
            const { cypher } = new TestClause(roundFunc).build();

            expect(cypher).toBe(`round(10.23, 3, 'HALF_DOWN')`);
        });
    });
});
