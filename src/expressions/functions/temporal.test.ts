/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";
import { TestClause } from "../../utils/TestClause";

describe("Temporal Functions", () => {
    describe.each(["date", "datetime", "localtime", "time", "localdatetime"] as const)("%s()", (fn) => {
        const temporalFn = Cypher[fn];

        test(`${fn} without parameters`, () => {
            const queryResult = new TestClause(temporalFn()).build();

            expect(queryResult.cypher).toBe(`${fn}()`);

            expect(queryResult.params).toEqual({});
        });

        test(`${fn} with timezone string parameter`, () => {
            const cypherFn = temporalFn(new Cypher.Param("9999-01-01"));
            const queryResult = new TestClause(cypherFn).build();

            expect(queryResult.cypher).toBe(`${fn}($param0)`);

            expect(queryResult.params).toEqual({
                param0: "9999-01-01",
            });
        });

        test(`${fn} with timezone string literal`, () => {
            const cypherFn = temporalFn(new Cypher.Literal("9999-01-01"));
            const queryResult = new TestClause(cypherFn).build();

            expect(queryResult.cypher).toBe(`${fn}("9999-01-01")`);

            expect(queryResult.params).toEqual({});
        });

        test(`${fn} with timezone object`, () => {
            const cypherFn = temporalFn(new Cypher.Map({ timezone: new Cypher.Literal("America/Los Angeles") }));
            const queryResult = new TestClause(cypherFn).build();

            expect(queryResult.cypher).toBe(`${fn}({ timezone: "America/Los Angeles" })`);

            expect(queryResult.params).toEqual({});
        });

        describe.each(["realtime", "statement", "transaction"] as const)(`${fn}.%s()`, (value) => {
            const temporalFn = Cypher[fn][value];

            test(`${fn}.${value} without parameters`, () => {
                const queryResult = new TestClause(temporalFn()).build();

                expect(queryResult.cypher).toBe(`${fn}.${value}()`);

                expect(queryResult.params).toEqual({});
            });

            test(`${fn}.${value} with timezone string parameter`, () => {
                const cypherFn = temporalFn(new Cypher.Param("9999-01-01"));
                const queryResult = new TestClause(cypherFn).build();

                expect(queryResult.cypher).toBe(`${fn}.${value}($param0)`);

                expect(queryResult.params).toEqual({
                    param0: "9999-01-01",
                });
            });

            test(`${fn}.${value} with timezone string literal`, () => {
                const cypherFn = temporalFn(new Cypher.Literal("9999-01-01"));
                const queryResult = new TestClause(cypherFn).build();

                expect(queryResult.cypher).toBe(`${fn}.${value}("9999-01-01")`);

                expect(queryResult.params).toEqual({});
            });

            test(`${fn}.${value} with timezone object`, () => {
                const cypherFn = temporalFn(new Cypher.Map({ timezone: new Cypher.Literal("America/Los Angeles") }));
                const queryResult = new TestClause(cypherFn).build();

                expect(queryResult.cypher).toBe(`${fn}.${value}({ timezone: "America/Los Angeles" })`);

                expect(queryResult.params).toEqual({});
            });
        });

        test(`${fn}.truncate()`, () => {
            const truncate = Cypher[fn].truncate("millennium", new Cypher.Variable());

            const queryResult = new TestClause(truncate).build();

            expect(queryResult.cypher).toBe(`${fn}.truncate("millennium", var0)`);

            expect(queryResult.params).toEqual({});
        });
        test(`${fn}.truncate() with 2 mapOfComponents`, () => {
            const truncate = Cypher[fn].truncate(
                "century",
                new Cypher.Variable(),
                new Cypher.Map({ day: new Cypher.Literal(5) })
            );

            const queryResult = new TestClause(truncate).build();

            expect(queryResult.cypher).toBe(`${fn}.truncate("century", var0, { day: 5 })`);

            expect(queryResult.params).toEqual({});
        });
    });

    describe("datetime", () => {
        test.each(["fromepoch", "fromepochmilis"] as const)("datetime.%s() with number parameters", (value) => {
            const fromepochFn = Cypher.datetime[value](2, 2);
            const queryResult = new TestClause(fromepochFn).build();

            expect(queryResult.cypher).toBe(`datetime.${value}(2, 2)`);

            expect(queryResult.params).toEqual({});
        });

        test.each(["fromepoch", "fromepochmilis"] as const)("datetime.%s() with Expr", (value) => {
            const fromepochFn = Cypher.datetime[value](
                Cypher.plus(new Cypher.Literal(2), new Cypher.Literal(2)),
                new Cypher.Param(10)
            );
            const queryResult = new TestClause(fromepochFn).build();

            expect(queryResult.cypher).toBe(`datetime.${value}((2 + 2), $param0)`);

            expect(queryResult.params).toEqual({
                param0: 10,
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
