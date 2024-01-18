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
