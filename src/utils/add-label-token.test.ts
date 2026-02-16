/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { addLabelToken } from "./add-label-token";

describe.each([":", "&"] as const)("addLabelToken", (operator) => {
    test("addLabelToken without labels using operator %s", () => {
        const result = addLabelToken(operator);
        expect(result).toBe("");
    });

    test("addLabelToken with a single label using operator %s", () => {
        const result = addLabelToken(operator, "Movie");
        expect(result).toBe(":Movie");
    });

    test("addLabelToken with two labels using operator %s", () => {
        const result = addLabelToken(operator, "Movie", "Film");
        expect(result).toBe(`:Movie${operator}Film`);
    });

    test("addLabelToken with multiple labels using operator %s", () => {
        const result = addLabelToken(operator, "Movie", "Film", "Video");
        expect(result).toBe(`:Movie${operator}Film${operator}Video`);
    });
});
