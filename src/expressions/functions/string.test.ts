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

import { TestClause } from "../../utils/TestClause";
import Cypher from "../..";

describe("String Functions", () => {
    // Functions with 1 argument
    test.each(["lTrim", "rTrim", "toLower", "toString", "toStringOrNull", "toUpper", "trim"] as const)(
        "%s",
        (value) => {
            const toLowerFunction = Cypher[value](new Cypher.Param("Hello"));
            const { cypher, params } = new TestClause(toLowerFunction).build();

            expect(cypher).toBe(`${value}($param0)`);

            expect(params).toEqual({
                param0: "Hello",
            });
        }
    );

    // Functions with 2 arguments
    test.each(["left", "right", "split"] as const)("%s", (value) => {
        const toLowerFunction = Cypher[value](new Cypher.Param("Hello"), new Cypher.Literal("Hello"));
        const { cypher, params } = new TestClause(toLowerFunction).build();

        expect(cypher).toBe(`${value}($param0, "Hello")`);

        expect(params).toEqual({
            param0: "Hello",
        });
    });

    test("replace", () => {
        const toLowerFunction = Cypher.replace(
            new Cypher.Param("Helo"),
            new Cypher.Literal("lo"),
            new Cypher.Literal("llo")
        );
        const { cypher, params } = new TestClause(toLowerFunction).build();

        expect(cypher).toMatchInlineSnapshot(`"replace($param0, \\"lo\\", \\"llo\\")"`);

        expect(params).toMatchInlineSnapshot(`
            {
              "param0": "Helo",
            }
        `);
    });

    test("substring with 2 arguments", () => {
        const toLowerFunction = Cypher.substring(new Cypher.Param("Hello"), new Cypher.Literal("lo"));
        const { cypher, params } = new TestClause(toLowerFunction).build();

        expect(cypher).toMatchInlineSnapshot(`"substring($param0, \\"lo\\")"`);

        expect(params).toMatchInlineSnapshot(`
            {
              "param0": "Hello",
            }
        `);
    });

    test("substring with 3 arguments", () => {
        const toLowerFunction = Cypher.substring(
            new Cypher.Param("Hello"),
            new Cypher.Literal("lo"),
            new Cypher.Literal(2)
        );
        const { cypher, params } = new TestClause(toLowerFunction).build();

        expect(cypher).toMatchInlineSnapshot(`"substring($param0, \\"lo\\", 2)"`);

        expect(params).toMatchInlineSnapshot(`
            {
              "param0": "Hello",
            }
        `);
    });
});
