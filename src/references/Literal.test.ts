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

describe("Literal", () => {
    test("Serialize string value", () => {
        const stringLiteral = new Cypher.Literal("hello");

        const testClause = new TestClause(stringLiteral);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`"hello"`);
    });

    test("Serialize boolean value", () => {
        const booleanLiteral = new Cypher.Literal(true);

        const testClause = new TestClause(booleanLiteral);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`true`);
    });

    test("Serialize number value", () => {
        const numberLiteral = new Cypher.Literal(5);

        const testClause = new TestClause(numberLiteral);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`5`);
    });

    test("Serialize array", () => {
        const literal = new Cypher.Literal(["hello", 5, "hello"]);

        const testClause = new TestClause(literal);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`["hello", 5, "hello"]`);
    });

    test("Serialize null", () => {
        const literal = new Cypher.Literal(null);

        const testClause = new TestClause(literal);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`NULL`);
    });

    test("Null constant literal", () => {
        const testClause = new TestClause(Cypher.Null);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`NULL`);
    });

    test("True constant literal", () => {
        const testClause = new TestClause(Cypher.true);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`true`);
    });

    test("False constant literal", () => {
        const testClause = new TestClause(Cypher.false);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toBe(`false`);
    });
});
