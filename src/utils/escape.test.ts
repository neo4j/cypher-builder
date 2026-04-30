/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../index";
import { escapeLiteralString } from "./escape";

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

    describe("escapeLiteralString", () => {
        test("Does not escape empty strings", () => {
            expect(escapeLiteralString("")).toBe("");
        });

        test.each([
            [`my "var"`, `my "var"`],
            [`my \\"var`, `my \\\\"var`],
            [`my 'var'`, `my \\'var\\'`],
            [`my \\'var`, `my \\\\\\'var`],
            [`'`, `\\'`],
            [`\\'`, `\\\\\\'`],
            [`\\u005C`, `\\\\`],
            [`\\u0027`, `\\'`],
        ])("Escape '%s'", (original, expected) => {
            expect(escapeLiteralString(original)).toBe(expected);
        });

        test.each(["this", "_var", "hello` dsa"])("Does not escape '%s'", (value) => {
            expect(escapeLiteralString(value)).toBe(value);
        });
    });

    // describe("escapeLiteralString", () => {
    //     test("escapes single quote", () => {
    //         expect(escapeLiteralString("it's")).toBe("it\\'s");
    //     });

    //     test("escapes lone backslash", () => {
    //         expect(escapeLiteralString("a\\b")).toBe("a\\\\b");
    //     });

    //     test("backslash before quote does NOT break out of the string (regression)", () => {
    //         // The original injection input.
    //         const input = "\\' or 1=1 //";
    //         const escaped = escapeLiteralString(input);
    //         // Expected: every `\` doubled, then the `'` escaped.
    //         expect(escaped).toBe("\\\\\\' or 1=1 //");

    //         // Sanity-check that wrapping in single quotes produces a string the
    //         // Cypher parser will read back as the original input.
    //         const wrapped = `'${escaped}'`;
    //         expect(wrapped).toBe("'\\\\\\' or 1=1 //'");
    //     });

    //     test("trailing backslash is doubled", () => {
    //         expect(escapeLiteralString("ends with \\")).toBe("ends with \\\\");
    //     });

    //     test("double quote is left alone (string is wrapped in single quotes)", () => {
    //         expect(escapeLiteralString('say "hi"')).toBe('say "hi"');
    //     });

    //     test("empty string", () => {
    //         expect(escapeLiteralString("")).toBe("");
    //     });

    //     test("only single quotes", () => {
    //         expect(escapeLiteralString("'''")).toBe("\\'\\'\\'");
    //     });

    //     test("only backslashes", () => {
    //         expect(escapeLiteralString("\\\\\\")).toBe("\\\\\\\\\\\\");
    //     });

    //     test("backslash before quote, full PoC payload", () => {
    //         const payload = "\\' or 1=1 return n; match (m:Movie) DETACH DELETE (m) //";
    //         const result = `'${escapeLiteralString(payload)}'`;
    //         // The closing quote of the Cypher string must come at the very end
    //         // of the wrapped value — not in the middle.
    //         expect(result.startsWith("'")).toBe(true);
    //         expect(result.endsWith("'")).toBe(true);
    //         // No interior unescaped single quote: every `'` between the outer
    //         // pair must be preceded by a backslash that is itself NOT preceded
    //         // by another backslash (i.e. `\'` not `\\'`).
    //         const interior = result.slice(1, -1);
    //         expect(/(^|[^\\])(\\\\)*'/.test(interior)).toBe(false);
    //     });
    // });
});
