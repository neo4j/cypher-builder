/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../index";
import { escapeLiteral } from "./escape";

describe("escaping", () => {
    describe.each(["escapeVariable", "escapeLabel", "escapeType", "escapeProperty"] as const)("utils.%s()", (func) => {
        test("Does not escape empty strings", () => {
            expect(Cypher.utils[func]("")).toBe("");
        });

        test.each(["this", "this0", "_var", "this_0"])("Does not escape '%s'", (value) => {
            expect(Cypher.utils[func](value)).toBe(value);
        });

        test.each([
            ["my var", "`my var`"],
            ["my `var", "`my ``var`"],
            ["0", "`0`"],
            ["0this", "`0this`"],
        ])("Escape '%s'", (original, expected) => {
            expect(Cypher.utils[func](original)).toBe(expected);
        });
    });

    describe("escapeLiteral", () => {
        test("Does not escape empty strings", () => {
            expect(escapeLiteral("")).toBe("''");
        });

        test.each([
            [`my "var"`, `'my "var"'`],
            [`my \\"var`, `'my \\\\"var'`],
            [`my 'var'`, `'my \\'var\\''`],
            [`my \\'var`, `'my \\\\\\'var'`],
            [`'`, `'\\''`],
            [`\\'`, `'\\\\\\''`],
            [`\\u005C`, `'\\\\'`],
            [`\\u0027`, `'\\''`],
        ])("Escape '%s'", (original, expected) => {
            expect(escapeLiteral(original)).toBe(expected);
        });

        test.each(["this", "_var", "hello` dsa"])("Does not escape '%s'", (value) => {
            expect(escapeLiteral(value)).toBe(`'${value}'`);
        });
    });
});
