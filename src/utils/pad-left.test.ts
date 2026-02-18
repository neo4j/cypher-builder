/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { padLeft } from "./pad-left";

describe("padLeft", () => {
    test("pads string", () => {
        expect(padLeft("my string")).toBe(" my string");
        expect(padLeft(" my string")).toBe("  my string");
    });

    test("returns empty string if input is undefined or empty string", () => {
        expect(padLeft(undefined)).toBe("");
        expect(padLeft("")).toBe("");
    });
});
