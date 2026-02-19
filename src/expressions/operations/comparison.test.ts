/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";
import { TestClause } from "../../utils/TestClause";

describe("comparison operations", () => {
    const predicate1 = new Cypher.Node().property("title");
    const predicate2 = Cypher.coalesce(new Cypher.Variable());

    test.each([
        ["eq", "="],
        ["neq", "<>"],
        ["gt", ">"],
        ["gte", ">="],
        ["lt", "<"],
        ["lte", "<="],
        ["in", "IN"],
        ["contains", "CONTAINS"],
        ["startsWith", "STARTS WITH"],
        ["endsWith", "ENDS WITH"],
        ["matches", "=~"],
    ] as const)("%s (%s) operator with 2 predicates", (func, operator) => {
        const op = Cypher[func](predicate1, predicate2);
        const { cypher } = new TestClause(op).build();
        expect(cypher).toEqual(`this0.title ${operator} coalesce(var1)`);
    });

    test("isNull (IS NULL) operator with 1 predicate", () => {
        const op = Cypher.isNull(predicate1);
        const { cypher } = new TestClause(op).build();
        expect(cypher).toMatchInlineSnapshot(`"this0.title IS NULL"`);
    });

    test("isNotNull (IS NOT NULL) operator with 1 predicate", () => {
        const op = Cypher.isNotNull(predicate1);
        const { cypher } = new TestClause(op).build();
        expect(cypher).toMatchInlineSnapshot(`"this0.title IS NOT NULL"`);
    });

    describe("IS NORMALIZED", () => {
        test("isNormalized (IS NORMALIZED) operator", () => {
            const stringLiteral = new Cypher.Literal(String.raw`the \u212B char`);
            const query = new Cypher.Return([Cypher.isNormalized(stringLiteral), "normalized"]);
            const { cypher } = query.build();
            expect(cypher).toMatchInlineSnapshot(`"RETURN 'the \\u212B char' IS NORMALIZED AS normalized"`);
        });

        test.each(["NFC", "NFD", "NFKC", "NFKD"] as const)(
            "isNormalized (IS NORMALIZED) operator with normalization type %s",
            (type) => {
                const stringLiteral = new Cypher.Literal(String.raw`the \u212B char`);
                const query = new Cypher.Return([Cypher.isNormalized(stringLiteral, type), "normalized"]);
                const { cypher } = query.build();
                expect(cypher).toBe(`RETURN 'the \\u212B char' IS ${type} NORMALIZED AS normalized`);
            }
        );

        test("isNotNormalized (IS NOT NORMALIZED) operator with one predicate", () => {
            const stringLiteral = new Cypher.Literal(String.raw`the \u212B char`);
            const query = new Cypher.Return([Cypher.isNotNormalized(stringLiteral), "notNormalized"]);
            const { cypher } = query.build();
            expect(cypher).toMatchInlineSnapshot(`"RETURN 'the \\u212B char' IS NOT NORMALIZED AS notNormalized"`);
        });

        test.each(["NFC", "NFD", "NFKC", "NFKD"] as const)(
            "isNotNormalized (IS NOT NORMALIZED) operator with normalization type %s",
            (type) => {
                const stringLiteral = new Cypher.Literal(String.raw`the \u212B char`);
                const query = new Cypher.Return([Cypher.isNotNormalized(stringLiteral, type), "notNormalized"]);
                const { cypher } = query.build();
                expect(cypher).toBe(`RETURN 'the \\u212B char' IS NOT ${type} NORMALIZED AS notNormalized`);
            }
        );
    });
});
