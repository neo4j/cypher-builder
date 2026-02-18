/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../index.js";
import { TestClause } from "../../utils/TestClause.js";

describe("Spatial Functions", () => {
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
