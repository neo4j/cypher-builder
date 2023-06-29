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

describe("Temporal Functions", () => {
    describe.each(["date", "datetime", "localtime", "time", "localdatetime"] as const)("%s", (value) => {
        const temporalFn = Cypher[value];

        test(`${value} without parameters`, () => {
            const queryResult = new TestClause(temporalFn()).build();

            expect(queryResult.cypher).toBe(`${value}()`);

            expect(queryResult.params).toEqual({});
        });

        test(`${value} with timezone string parameter`, () => {
            const cypherFn = temporalFn(new Cypher.Param("9999-01-01"));
            const queryResult = new TestClause(cypherFn).build();

            expect(queryResult.cypher).toBe(`${value}($param0)`);

            expect(queryResult.params).toEqual({
                param0: "9999-01-01",
            });
        });

        test(`${value} with timezone string literal`, () => {
            const cypherFn = temporalFn(new Cypher.Literal("9999-01-01"));
            const queryResult = new TestClause(cypherFn).build();

            expect(queryResult.cypher).toBe(`${value}("9999-01-01")`);

            expect(queryResult.params).toEqual({});
        });

        test(`${value} with timezone object`, () => {
            const cypherFn = temporalFn(new Cypher.Map({ timezone: new Cypher.Literal("America/Los Angeles") }));
            const queryResult = new TestClause(cypherFn).build();

            expect(queryResult.cypher).toBe(`${value}({ timezone: "America/Los Angeles" })`);

            expect(queryResult.params).toEqual({});
        });
    });
});
