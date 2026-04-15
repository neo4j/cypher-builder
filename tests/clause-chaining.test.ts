/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../src/index";

describe("Clause chaining", () => {
    describe("Match", () => {
        const clause = new Cypher.Match(new Cypher.Pattern(new Cypher.Node()));

        it.each([
            "where",
            "and",
            "return",
            "remove",
            "set",
            "delete",
            "detachDelete",
            "with",
            "unwind",
            "match",
            "optionalMatch",
            "merge",
            "create",
            "orderBy",
            "limit",
            "skip",
            "offset",
            "foreach",
            "let",
            "finish",
            "filter",
        ] as const)("Match.%s", (value) => {
            expect(clause[value]).toEqual(expect.any(Function));
        });
    });

    describe("Create", () => {
        const clause = new Cypher.Create(new Cypher.Pattern(new Cypher.Node()));

        it.each([
            "return",
            "remove",
            "set",
            "delete",
            "detachDelete",
            "with",
            "merge",
            "create",
            "orderBy",
            "limit",
            "skip",
            "offset",
            "let",
            "finish",
            "filter",
        ] as const)("Create.%s", (value) => {
            expect(clause[value]).toEqual(expect.any(Function));
        });
    });

    describe("Call", () => {
        const clause = new Cypher.Call(new Cypher.Match(new Cypher.Pattern(new Cypher.Node())));

        it.each([
            "return",
            "remove",
            "set",
            "delete",
            "detachDelete",
            "with",
            "unwind",
            "match",
            "optionalMatch",
            "merge",
            "create",
            "orderBy",
            "limit",
            "skip",
            "offset",
            "let",
        ] as const)("Call.%s", (value) => {
            expect(clause[value]).toEqual(expect.any(Function));
        });
    });

    describe("Foreach", () => {
        const list = new Cypher.Literal([1, 2, 3]);
        const variable = new Cypher.Variable();

        const movieNode = new Cypher.Node();
        const createMovie = new Cypher.Create(new Cypher.Pattern(movieNode)).set([movieNode.property("id"), variable]);

        const clause = new Cypher.Foreach(variable).in(list).do(createMovie);

        it.each(["return", "remove", "set", "delete", "detachDelete", "with", "merge", "create", "let"] as const)(
            "Foreach.%s",
            (value) => {
                expect(clause[value]).toEqual(expect.any(Function));
            }
        );
    });

    describe("Merge", () => {
        const clause = new Cypher.Merge(new Cypher.Pattern(new Cypher.Node()));

        it.each([
            "return",
            "remove",
            "set",
            "delete",
            "detachDelete",
            "with",
            "merge",
            "create",
            "orderBy",
            "limit",
            "skip",
            "offset",
            "let",
            "filter",
        ] as const)("Merge.%s", (value) => {
            expect(clause[value]).toEqual(expect.any(Function));
        });
    });

    describe("Return", () => {
        const clause = new Cypher.Return();

        it.each(["orderBy", "limit", "skip", "offset"] as const)("Return.%s", (value) => {
            expect(clause[value]).toEqual(expect.any(Function));
        });
    });

    describe("Unwind", () => {
        const clause = new Cypher.Unwind([new Cypher.Variable(), "a"]);

        it.each([
            "return",
            "remove",
            "set",
            "delete",
            "detachDelete",
            "with",
            "unwind",
            "match",
            "optionalMatch",
            "merge",
            "create",
            "orderBy",
            "limit",
            "skip",
            "offset",
            "let",
            "filter",
        ] as const)("Unwind.%s", (value) => {
            expect(clause[value]).toEqual(expect.any(Function));
        });
    });

    describe("Filter", () => {
        const clause = new Cypher.Filter(Cypher.true);

        it.each([
            "return",
            "with",
            // "unwind",
            "match",
            "optionalMatch",
            "merge",
            "create",
            // "let",
            // "filter",
        ] as const)("Filter.%s", (value) => {
            expect(clause[value]).toEqual(expect.any(Function));
        });
    });
    // describe("Use", () => {
    //     const clause = new Cypher.Use("dsa", new Cypher.Match(new Cypher.Node()));

    //     it.each([
    //         // "return",
    //         // "delete",
    //         // "detachDelete",
    //         // "with",
    //         // "unwind",
    //         // "match",
    //         // "optionalMatch",
    //         // "merge",
    //         // "create",
    //     ] as const)("Use.%s", (value) => {
    //         expect(clause[value]).toEqual(expect.any(Function));
    //     });
    // });
    describe("With", () => {
        const clause = new Cypher.With();

        it.each([
            "where",
            "and",
            "return",
            "delete",
            "detachDelete",
            "with",
            "set",
            "remove",
            "unwind",
            "match",
            "optionalMatch",
            "merge",
            "create",
            "orderBy",
            "skip",
            "limit",
            "let",
            "filter",
        ] as const)("With.%s", (value) => {
            expect(clause[value]).toEqual(expect.any(Function));
        });
    });

    describe("Let", () => {
        const clause = new Cypher.Let();

        it.each([
            "return",
            "with",
            "match",
            "optionalMatch",
            "create",
            "merge",
            "finish",
            "callProcedure",
            "call",
            "filter",
        ] as const)("Let.%s", (value) => {
            expect(clause[value]).toEqual(expect.any(Function));
        });
    });

    describe("Procedure Yield", () => {
        const clause = new Cypher.Procedure<"result1">("customProcedure").yield("result1");

        it.each([
            "where",
            "return",
            "with",
            "and",
            "delete",
            "detachDelete",
            "unwind",
            "match",
            "optionalMatch",
            "merge",
            "create",
            "remove",
            "set",
            "orderBy",
            "skip",
            "limit",
        ] as const)("yield.%s", (value) => {
            expect(clause[value]).toEqual(expect.any(Function));
        });
    });

    describe("Invalid Chaining", () => {
        test("Multiple top-level clauses should fail", () => {
            const match = new Cypher.Match(new Cypher.Pattern(new Cypher.Node()));
            match.return("*");
            expect(() => {
                match.return("*");
            }).toThrow("Cannot add <Clause Return> to <Clause Match> because Match it is not the last clause.");
        });
    });
});
