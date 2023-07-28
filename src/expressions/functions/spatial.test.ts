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

describe("Spatial Functions", () => {
    describe("4.x deprecated functions", () => {
        test.each(["distance"] as const)("%s", (value) => {
            const leftExpr = new Cypher.Variable();
            const rightExpr = new Cypher.Variable();
            const spatialFn = Cypher[value](leftExpr, rightExpr);

            const queryResult = new TestClause(spatialFn).build();

            expect(queryResult.cypher).toBe(`${value}(var0, var1)`);
            expect(queryResult.params).toEqual({});
        });
    });

    test("point function", () => {
        const pointFn = Cypher.point(new Cypher.Variable());

        const queryResult = new TestClause(pointFn).build();

        expect(queryResult.cypher).toBe(`point(var0)`);
        expect(queryResult.params).toEqual({});
    });

    test("point.distance", () => {
        const leftExpr = new Cypher.Variable();
        const rightExpr = new Cypher.Variable();
        const pointDistanceFn = Cypher.point.distance(leftExpr, rightExpr);

        const queryResult = new TestClause(pointDistanceFn).build();

        expect(queryResult.cypher).toBe(`point.distance(var0, var1)`);
        expect(queryResult.params).toEqual({});
    });

    test("point.withinBBox", () => {
        const pointVar = new Cypher.Variable();
        const leftExpr = new Cypher.Variable();
        const rightExpr = new Cypher.Variable();
        const pointDistanceFn = Cypher.point.withinBBox(pointVar, leftExpr, rightExpr);

        const queryResult = new TestClause(pointDistanceFn).build();

        expect(queryResult.cypher).toBe(`point.withinBBox(var0, var1, var2)`);
        expect(queryResult.params).toEqual({});
    });
});
