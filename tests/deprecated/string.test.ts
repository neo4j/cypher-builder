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

import Cypher from "../../src";
import { TestClause } from "../../src/utils/TestClause";

describe("String Functions - Deprecated", () => {
    // Functions with 1 argument
    test.each(["lTrim", "rTrim"] as const)("%s", (value) => {
        const testFunction = Cypher[value](new Cypher.Param("Hello"));
        const { cypher, params } = new TestClause(testFunction).build();

        expect(cypher).toBe(`${value}($param0)`);

        expect(params).toEqual({
            param0: "Hello",
        });
    });

    // Functions with 2 arguments
    test.each(["lTrim", "rTrim", "btrim"] as const)("%s", (value) => {
        const testFunction = Cypher[value](new Cypher.Param("Hello"), new Cypher.Literal("Hello"));
        const { cypher, params } = new TestClause(testFunction).build();

        expect(cypher).toBe(`${value}($param0, "Hello")`);

        expect(params).toEqual({
            param0: "Hello",
        });
    });

    test.each(["btrim", "lTrim", "rTrim"] as const)("%s with string parameter", (value) => {
        const testFunction = Cypher[value]("Hello");
        const { cypher, params } = new TestClause(testFunction).build();

        expect(cypher).toBe(`${value}("Hello")`);

        expect(params).toEqual({});
    });
});
