/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";
import { TestClause } from "../../utils/TestClause";

describe("Aggregation Functions", () => {
    describe.each(["count", "min", "max", "avg", "sum", "collect", "stDev", "stDevP"] as const)("%s", (value) => {
        const testParam = new Cypher.Param("Hello");
        test(value, () => {
            const aggregationFunction = Cypher[value](testParam);
            const queryResult = new TestClause(aggregationFunction).build();

            expect(queryResult.cypher).toBe(`${value}($param0)`);
            expect(queryResult.params).toEqual({
                param0: "Hello",
            });
        });

        test(`${value} with DISTINCT`, () => {
            const aggregationFunction = Cypher[value](testParam).distinct();
            const queryResult = new TestClause(aggregationFunction).build();

            expect(queryResult.cypher).toBe(`${value}(DISTINCT $param0)`);
            expect(queryResult.params).toEqual({
                param0: "Hello",
            });
        });
    });

    test("count(*)", () => {
        const aggregationFunction = Cypher.count("*");
        const queryResult = new TestClause(aggregationFunction).build();

        expect(queryResult.cypher).toBe("count(*)");
    });

    test("count(*) with distinct fails", () => {
        expect(() => {
            Cypher.count("*").distinct();
        }).toThrow("count(*) is not supported with DISTINCT");
    });

    describe.each(["percentileCont", "percentileDisc"] as const)("%s", (value) => {
        const testParam = new Cypher.Param(10);
        test(value, () => {
            const aggregationFunction = Cypher[value](testParam, 0.5);
            const queryResult = new TestClause(aggregationFunction).build();

            expect(queryResult.cypher).toBe(`${value}($param0, 0.5)`);
            expect(queryResult.params).toEqual({
                param0: 10,
            });
        });

        test(`${value} with DISTINCT`, () => {
            const aggregationFunction = Cypher[value](testParam, 0.5).distinct();
            const queryResult = new TestClause(aggregationFunction).build();

            expect(queryResult.cypher).toBe(`${value}(DISTINCT $param0, 0.5)`);
            expect(queryResult.params).toEqual({
                param0: 10,
            });
        });
    });
});
