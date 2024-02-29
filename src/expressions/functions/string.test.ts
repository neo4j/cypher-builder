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

describe("String Functions", () => {
    // Functions with 1 argument
    test.each(["lTrim", "rTrim", "toLower", "toString", "toStringOrNull", "toUpper", "trim", "normalize"] as const)(
        "%s",
        (value) => {
            const testFunction = Cypher[value](new Cypher.Param("Hello"));
            const { cypher, params } = new TestClause(testFunction).build();

            expect(cypher).toBe(`${value}($param0)`);

            expect(params).toEqual({
                param0: "Hello",
            });
        }
    );

    // Functions with 2 arguments
    test.each(["left", "right", "split"] as const)("%s", (value) => {
        const testFunction = Cypher[value](new Cypher.Param("Hello"), new Cypher.Literal("Hello"));
        const { cypher, params } = new TestClause(testFunction).build();

        expect(cypher).toBe(`${value}($param0, "Hello")`);

        expect(params).toEqual({
            param0: "Hello",
        });
    });

    test("replace", () => {
        const replaceFunction = Cypher.replace(
            new Cypher.Param("Helo"),
            new Cypher.Literal("lo"),
            new Cypher.Literal("llo")
        );
        const { cypher, params } = new TestClause(replaceFunction).build();

        expect(cypher).toMatchInlineSnapshot(`"replace($param0, \\"lo\\", \\"llo\\")"`);

        expect(params).toMatchInlineSnapshot(`
            {
              "param0": "Helo",
            }
        `);
    });

    test("substring with 2 arguments", () => {
        const substringFunction = Cypher.substring(new Cypher.Param("Hello"), new Cypher.Literal("lo"));
        const { cypher, params } = new TestClause(substringFunction).build();

        expect(cypher).toMatchInlineSnapshot(`"substring($param0, \\"lo\\")"`);

        expect(params).toMatchInlineSnapshot(`
            {
              "param0": "Hello",
            }
        `);
    });

    test("substring with 3 arguments", () => {
        const substring = Cypher.substring(new Cypher.Param("Hello"), new Cypher.Literal("lo"), new Cypher.Literal(2));
        const { cypher, params } = new TestClause(substring).build();

        expect(cypher).toMatchInlineSnapshot(`"substring($param0, \\"lo\\", 2)"`);

        expect(params).toMatchInlineSnapshot(`
            {
              "param0": "Hello",
            }
        `);
    });

    test.each(["NFC", "NFD", "NFKC", "NFKD"] as const)("normalize with normalForm '%s' parameter", (normalForm) => {
        const normalizeFunction = Cypher.normalize(new Cypher.Param("Hello"), normalForm);
        const { cypher, params } = new TestClause(normalizeFunction).build();

        expect(cypher).toBe(`normalize($param0, "${normalForm}")`);

        expect(params).toEqual({
            param0: "Hello",
        });
    });

    test("normalize with normalForm parameter as an expression", () => {
        const normalizeFunction = Cypher.normalize(new Cypher.Param("Hello"), new Cypher.Param("NFC"));
        const { cypher, params } = new TestClause(normalizeFunction).build();

        expect(cypher).toBe(`normalize($param0, $param1)`);

        expect(params).toEqual({
            param0: "Hello",
            param1: "NFC",
        });
    });
});
