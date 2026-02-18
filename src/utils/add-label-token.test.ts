/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { addLabelToken } from "./add-label-token.js";

describe("addLabelToken", () => {
    test("addLabelToken without labels", () => {
        const result = addLabelToken();
        expect(result).toBe("");
    });

    test("addLabelToken with a single label", () => {
        const result = addLabelToken("Movie");
        expect(result).toBe(":Movie");
    });

    test("addLabelToken with two labels", () => {
        const result = addLabelToken("Movie", "Film");
        expect(result).toBe(`:Movie&Film`);
    });

    test("addLabelToken with multiple labels", () => {
        const result = addLabelToken("Movie", "Film", "Video");
        expect(result).toBe(`:Movie&Film&Video`);
    });
});
