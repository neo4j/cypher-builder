/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { stringifyObject } from "./stringify-object";

describe("stringifyObject", () => {
    test("creates a valid cypher object from a js object", () => {
        const result = stringifyObject({
            this: "this",
            that: `"that"`,
        });

        expect(result).toBe(`{ this: this, that: "that" }`);
    });

    test("ignores undefined, null and empty string values", () => {
        const result = stringifyObject({
            nobody: "expects",
            the: undefined,
            spanish: null,
            inquisition: "",
        });

        expect(result).toBe(`{ nobody: expects }`);
    });

    test("escape keys", () => {
        const result = stringifyObject({
            ["this name"]: "this",
            that: `"that"`,
        });

        expect(result).toBe(`{ \`this name\`: this, that: "that" }`);
    });
});
