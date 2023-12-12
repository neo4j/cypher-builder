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

describe("Scalar Functions", () => {
    // no parameter functions
    test.each(["randomUUID", "timestamp"] as const)("%s()", (func) => {
        const cypherFunction = Cypher[func]();
        const queryResult = new TestClause(cypherFunction).build();

        expect(queryResult.cypher).toEqual(`${func}()`);
    });

    // 1 parameter functions
    test.each([
        "id",
        "elementId",
        "endNode",
        "size",
        "head",
        "last",
        "length",
        "properties",
        "startNode",
        "toBoolean",
        "toBooleanOrNull",
        "toFloat",
        "toFloatOrNull",
        "toInteger",
        "toIntegerOrNull",
        "type",
        "valueType",
        "char_length",
        "character_length",
    ] as const)("%s()", (func) => {
        const param = new Cypher.Variable();

        const cypherFunction = Cypher[func](param);
        const queryResult = new TestClause(cypherFunction).build();

        expect(queryResult.cypher).toEqual(`${func}(var0)`);
    });

    // 2 parameter functions
    test.each(["nullIf"] as const)("%s()", (func) => {
        const param1 = new Cypher.Variable();
        const param2 = new Cypher.Variable();

        const cypherFunction = Cypher[func](param1, param2);
        const queryResult = new TestClause(cypherFunction).build();

        expect(queryResult.cypher).toEqual(`${func}(var0, var1)`);
    });

    test("coalesce()", () => {
        const testParam = new Cypher.Param("Hello");
        const nullParam = Cypher.Null;
        const literal = new Cypher.Literal("arthur");

        const coalesceFunction = Cypher.coalesce(nullParam, testParam, literal);
        const queryResult = new TestClause(coalesceFunction).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"coalesce(NULL, $param0, \\"arthur\\")"`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "Hello",
            }
        `);
    });

    test("size() applied to pattern comprehension", () => {
        const patternComprehension = new Cypher.PatternComprehension(
            new Cypher.Pattern(new Cypher.Node()).related().to(),
            new Cypher.Variable()
        );
        const cypherFunction = Cypher.size(patternComprehension);
        const queryResult = new TestClause(cypherFunction).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"size([(this1)-[this2]->(this3) | var0])"`);
    });

    test("size() applied to string", () => {
        const cypherFunction = Cypher.size(new Cypher.Literal("Hello"));
        const queryResult = new TestClause(cypherFunction).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"size(\\"Hello\\")"`);
    });
});
