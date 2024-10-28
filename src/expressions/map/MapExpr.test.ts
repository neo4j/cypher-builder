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

describe("Map Expression", () => {
    test("Create from object", () => {
        const map = new Cypher.Map({
            foo: new Cypher.Literal("barr"),
            var: new Cypher.Variable(),
            param: new Cypher.Param("test"),
        });

        const queryResult = new TestClause(map).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"{ foo: \\"barr\\", var: var0, param: $param0 }"`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "test",
            }
        `);
    });

    test("Set key-value and object", () => {
        const map = new Cypher.Map();

        map.set("key", new Cypher.Param("value"));
        map.set({
            value2: new Cypher.Param("test"),
            value3: new Cypher.Literal("another value"),
        });

        map.set("value2", new Cypher.Literal("Override"));

        const queryResult = new TestClause(map).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"{ key: $param0, value2: \\"Override\\", value3: \\"another value\\" }"`
        );

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "value",
            }
        `);
    });

    test("size", () => {
        const map = new Cypher.Map({
            foo: new Cypher.Literal("barr"),
            var: new Cypher.Variable(),
            param: new Cypher.Param("test"),
        });

        map.set("another", new Cypher.Literal("another"));

        expect(map.size).toBe(4);
    });

    test("Fails setting nullable values", () => {
        const map = new Cypher.Map();

        expect(() => {
            map.set({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
                myValue: "" as any,
            });
        }).toThrow("Missing value on map key myValue");
    });
});
