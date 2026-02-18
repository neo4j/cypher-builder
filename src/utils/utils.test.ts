/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../index.js";

describe("CypherBuilder Utils", () => {
    describe("escapeLabel", () => {
        const cases = [
            ["`", "````"],
            ["\u0060", "````"],
            ["\\u0060", "````"],
            ["\\\u0060", "`\\```"],
            ["```", "````````"],
            ["\u0060\u0060\u0060", "````````"],
            ["\\u0060\\u0060\\u0060", "````````"],
            ["Hello`", "`Hello```"],
            ["Hi````there", "`Hi````````there`"],
            ["Hi`````there", "`Hi``````````there`"],
            ["`a`b`c`", "```a``b``c```"],
            ["\u0060a`b`c\u0060d\u0060", "```a``b``c``d```"],
            ["\\u0060a`b`c\\u0060d\\u0060", "```a``b``c``d```"],
            ["ABC", "ABC"],
            ["A C", "`A C`"],
            ["A` C", "`A`` C`"],
            ["A`` C", "`A```` C`"],
            ["ALabel", "ALabel"],
            ["A Label", "`A Label`"],
            ["A `Label", "`A ``Label`"],
            ["`A `Label", "```A ``Label`"],
            ["Spring Data Neo4j⚡️RX", "`Spring Data Neo4j⚡️RX`"],
            ["Foo \u0060", "`Foo ```"], // This is the backtick itself in the string
            ["Foo \\u0060", "`Foo ```"], // This is the backtick unicode escaped so that without further processing `foo \u0060` would end up at Cypher
            ["Foo``bar", "`Foo````bar`"],
            ["Foo\\``bar", "`Foo\\````bar`"],
            ["Foo\\\\``bar", "`Foo\\\\````bar`"],
            ["Foo\u005cbar", "`Foo\\bar`"],
            ["Foo\u005c\u0060bar", "`Foo\\``bar`"],
            ["Foo\u005cu0060bar", "`Foo``bar`"],
            ["Foo\\u005cu0060bar", "`Foo\\u005cu0060bar`"],
            ["Foo\u005c\\u0060bar", "`Foo\\``bar`"],
            ["\u005c\u005cu0060", "`\\```"],
            ["\u005cu005cu0060", "`\\u005cu0060`"],
        ];
        test.each(cases)('Parse "%s"', (value, expected) => {
            const escapedLabel = Cypher.utils.escapeLabel(value);
            expect(escapedLabel).toBe(expected);
        });

        test("escapeLabel", () => {
            const label = Cypher.utils.escapeLabel("Test Label");
            expect(label).toBe("`Test Label`");
        });

        test("escapeLabel ignored if not needed", () => {
            const label = Cypher.utils.escapeLabel("TestLabel");
            expect(label).toBe("TestLabel");
        });

        test("escapeType", () => {
            const label = Cypher.utils.escapeType("Test Label");
            expect(label).toBe("`Test Label`");
        });

        test("escapeLabel ignored if not needed", () => {
            const label = Cypher.utils.escapeType("TestLabel");
            expect(label).toBe("TestLabel");
        });
    });

    test("toCypherParams", () => {
        const cypherParams = Cypher.utils.toCypherParams({
            param1: "my param",
            param2: 5,
        });

        expect(cypherParams).toEqual({
            param1: new Cypher.Param("my param"),
            param2: new Cypher.Param(5),
        });
    });
});
