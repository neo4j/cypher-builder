/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { padBlock } from "./pad-block";

describe("padBlock", () => {
    test("pads each line with two spaces by default", () => {
        expect(padBlock("a\nb")).toBe("  a\n  b");
    });

    test("uses custom indent width", () => {
        expect(padBlock("x\ny", 4)).toBe("    x\n    y");
    });

    test("single line without newline", () => {
        expect(padBlock("only")).toBe("  only");
    });

    test("empty string", () => {
        expect(padBlock("")).toBe("  ");
    });

    test("zero spaces repeats padding string correctly", () => {
        expect(padBlock("a\nb", 0)).toBe("a\nb");
    });
});
