/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";

describe("Load CSV Functions", () => {
    test.each(["file", "linenumber"] as const)("%s()", (value) => {
        const func = Cypher[value]();

        const { cypher } = new Cypher.Return(func).build();
        expect(cypher).toBe(`RETURN ${value}()`);
    });
});
