/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import * as Cypher from "../Cypher";

describe("CypherBuilder Unwind", () => {
    test("Unwind movies", () => {
        const matrix = new Cypher.Map({ title: new Cypher.Literal("Matrix") });
        const matrix2 = new Cypher.Map({ title: new Cypher.Literal("Matrix 2") });
        const moviesList = new Cypher.List([matrix, matrix2]);
        const unwindQuery = new Cypher.Unwind([moviesList, "batch"]);
        const queryResult = unwindQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"UNWIND [{ title: \\"Matrix\\" }, { title: \\"Matrix 2\\" }] AS batch"`
        );
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Unwind and delete", () => {
        const variable = new Cypher.Variable();
        const unwindQuery = new Cypher.Unwind([new Cypher.Variable(), variable]).delete(variable);
        const queryResult = unwindQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "UNWIND var0 AS var1
            DELETE var1"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Unwind with set, remove and delete", () => {
        const variable = new Cypher.Variable();
        const unwindQuery = new Cypher.Unwind([new Cypher.Variable(), variable])
            .set([variable.property("title"), new Cypher.Param("The Matrix")])
            .remove(variable.property("title"))
            .delete(variable);
        const queryResult = unwindQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"UNWIND var0 AS var1
SET
    var1.title = $param0
REMOVE var1.title
DELETE var1"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "The Matrix",
}
`);
    });

    test("Chained Unwind", () => {
        const variable = new Cypher.Variable();
        const unwindQuery = new Cypher.Unwind([new Cypher.Variable(), variable]).unwind([
            variable,
            new Cypher.Variable(),
        ]);
        const queryResult = unwindQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"UNWIND var0 AS var1
UNWIND var1 AS var2"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Chained Unwind with existing clause", () => {
        const variable = new Cypher.Variable();

        const secondUnwind = new Cypher.Unwind([variable, new Cypher.Variable()]);
        const unwindQuery = new Cypher.Unwind([new Cypher.Variable(), variable]).unwind(secondUnwind);
        const queryResult = unwindQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"UNWIND var0 AS var1
UNWIND var1 AS var2"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Fails to chain unwind if there is an existing chained clause", () => {
        const variable = new Cypher.Variable();
        const unwindQuery = new Cypher.Unwind([new Cypher.Variable(), variable]);

        unwindQuery.with("*");

        expect(() => {
            unwindQuery.unwind([variable, new Cypher.Variable()]);
        }).toThrow("Cannot add <Clause Unwind> to <Clause Unwind> because Unwind it is not the last clause.");
    });

    test("Unwind movies with order", () => {
        const matrix = new Cypher.Map({ title: new Cypher.Literal("Matrix") });
        const matrix2 = new Cypher.Map({ title: new Cypher.Literal("Matrix 2") });
        const moviesList = new Cypher.List([matrix, matrix2]);

        const batch = new Cypher.Variable();
        const unwindQuery = new Cypher.Unwind([moviesList, batch]).orderBy([batch.property("title", "DESC")]).limit(10);
        const queryResult = unwindQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"UNWIND [{ title: \\"Matrix\\" }, { title: \\"Matrix 2\\" }] AS var0
ORDER BY var0.title.DESC ASC
LIMIT 10"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
