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
import { CypherFunction } from "./CypherFunctions";

describe("Temporal Functions", () => {
    describe.each(["date", "datetime", "localtime", "time", "localdatetime"] as const)("%s()", (value) => {
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

    describe("date", () => {
        describe.each(["realtime", "statement", "transaction"] as const)("date.%s()", (value) => {
            const temporalFn = Cypher.date[value];

            test(`date.${value} without parameters`, () => {
                const queryResult = new TestClause(temporalFn()).build();

                expect(queryResult.cypher).toBe(`date.${value}()`);

                expect(queryResult.params).toEqual({});
            });

            test(`date.${value} with timezone string parameter`, () => {
                const cypherFn = temporalFn(new Cypher.Param("9999-01-01"));
                const queryResult = new TestClause(cypherFn).build();

                expect(queryResult.cypher).toBe(`date.${value}($param0)`);

                expect(queryResult.params).toEqual({
                    param0: "9999-01-01",
                });
            });

            test(`date.${value} with timezone string literal`, () => {
                const cypherFn = temporalFn(new Cypher.Literal("9999-01-01"));
                const queryResult = new TestClause(cypherFn).build();

                expect(queryResult.cypher).toBe(`date.${value}("9999-01-01")`);

                expect(queryResult.params).toEqual({});
            });

            test(`date.${value} with timezone object`, () => {
                const cypherFn = temporalFn(new Cypher.Map({ timezone: new Cypher.Literal("America/Los Angeles") }));
                const queryResult = new TestClause(cypherFn).build();

                expect(queryResult.cypher).toBe(`date.${value}({ timezone: "America/Los Angeles" })`);

                expect(queryResult.params).toEqual({});
            });
        });

        describe("date.truncate()", () => {
            test(`date.truncate()`, () => {
                const truncate = Cypher.date.truncate("millennium", new Cypher.Variable());

                const queryResult = new TestClause(truncate).build();

                expect(queryResult.cypher).toMatchInlineSnapshot(`"date.truncate(\\"millennium\\", var0)"`);

                expect(queryResult.params).toEqual({});
            });
            test(`date.truncate() with 2 mapOfComponents`, () => {
                const truncate = Cypher.date.truncate(
                    "millennium",
                    new Cypher.Variable(),
                    new Cypher.Map({ day: new Cypher.Literal(5) })
                );

                const queryResult = new TestClause(truncate).build();

                expect(queryResult.cypher).toMatchInlineSnapshot(`"date.truncate(\\"millennium\\", var0, { day: 5 })"`);

                expect(queryResult.params).toEqual({});
            });
        });
    });

    describe("duration", () => {
        test("duration()", () => {
            const durationFunc = Cypher.duration(
                new Cypher.Map({ days: new Cypher.Literal(2), hours: new Cypher.Param(10) })
            );

            const queryResult = new TestClause(durationFunc).build();

            expect(queryResult.cypher).toMatchInlineSnapshot(`"duration({ days: 2, hours: $param0 })"`);

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": 10,
                }
            `);
        });

        test.each(["between", "inMonths", "inDays", "inSeconds"] as const)("duration.%s()", (fun) => {
            const instant1 = new Cypher.Variable();
            const instant2 = new Cypher.Variable();

            const durationFunc = Cypher.duration[fun](instant1, instant2);

            const queryResult = new TestClause(durationFunc).build();

            expect(queryResult.cypher).toBe(`duration.${fun}(var0, var1)`);
        });
    });
});
