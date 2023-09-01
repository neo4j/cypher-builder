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

import Cypher from "../src";

// TODO: Implement missing methods in clauses
describe("Clause concatenation", () => {
    describe("Match", () => {
        const clause = new Cypher.Match(new Cypher.Node());

        it.each([
            "where",
            "and",
            "return",
            "remove",
            "set",
            "delete",
            "detachDelete",
            "with",
            // "unwind",
            // "match",
            // "optionalMatch",
            // "merge",
            // "create",
            "assignToPath",
        ] as const)("Match.%s", (value) => {
            expect(clause[value]).toBeFunction();
        });
    });

    describe("Create", () => {
        const clause = new Cypher.Create(new Cypher.Node());

        it.each([
            "return",
            // "remove",
            "set",
            // "delete",
            // "detachDelete",
            // "with",
            // "merge",
            // "create",
            "assignToPath",
        ] as const)("Create.%s", (value) => {
            expect(clause[value]).toBeFunction();
        });
    });

    describe("Call", () => {
        const clause = new Cypher.Call(new Cypher.Match(new Cypher.Node()));

        it.each([
            "return",
            // "remove",
            // "set",
            // "delete",
            // "detachDelete",
            "with",
            "unwind",
            // "match",
            // "optionalMatch",
            // "merge",
            // "create",
        ] as const)("Call.%s", (value) => {
            expect(clause[value]).toBeFunction();
        });
    });

    describe("Foreach", () => {
        const list = new Cypher.Literal([1, 2, 3]);
        const variable = new Cypher.Variable();

        const movieNode = new Cypher.Node();
        const createMovie = new Cypher.Create(movieNode).set([movieNode.property("id"), variable]);

        const clause = new Cypher.Foreach(variable, list, createMovie);

        it.each([
            // "return",
            // "remove",
            // "set",
            // "delete",
            // "detachDelete",
            "with",
            // "merge",
            // "create",
        ] as const)("Foreach.%s", (value) => {
            expect(clause[value]).toBeFunction();
        });
    });

    describe("Merge", () => {
        const clause = new Cypher.Merge(new Cypher.Node());

        it.each([
            "return",
            // "remove",
            "set",
            "delete",
            "detachDelete",
            // "with",
            // "merge",
            // "create",
            "assignToPath",
        ] as const)("Merge.%s", (value) => {
            expect(clause[value]).toBeFunction();
        });
    });
    describe("Return", () => {
        const clause = new Cypher.Return();

        it.each(["orderBy", "limit", "skip"] as const)("Return.%s", (value) => {
            expect(clause[value]).toBeFunction();
        });
    });

    describe("Unwind", () => {
        const clause = new Cypher.Unwind();

        it.each([
            // "where",
            // "and",
            // "return",
            // "remove",
            // "set",
            "delete",
            "detachDelete",
            "with",
            // "unwind",
            // "match",
            // "optionalMatch",
            // "merge",
            // "create",
            // "assignToPath",
            // "orderBy",
            // "skip",
            // "limit",
        ] as const)("Unwind.%s", (value) => {
            expect(clause[value]).toBeFunction();
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
    //         expect(clause[value]).toBeFunction();
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
            // "unwind",
            // "match",
            // "optionalMatch",
            // "merge",
            // "create",
            "orderBy",
            "skip",
            "limit",
        ] as const)("With.%s", (value) => {
            expect(clause[value]).toBeFunction();
        });
    });
});
