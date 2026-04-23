/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherEnvironment } from "../Environment";
import type { CypherCompilable } from "../types";
import { compileCypherIfExists } from "./compile-cypher-if-exists";

describe("compileCypherIfExists", () => {
    const env = new CypherEnvironment();

    test("returns empty string when element is undefined", () => {
        expect(compileCypherIfExists(undefined, env)).toBe("");
    });

    test("returns cypher", () => {
        const element: CypherCompilable = { getCypher: () => "n.prop" };
        expect(compileCypherIfExists(element, env)).toBe("n.prop");
    });

    test("applies prefix and suffix when cypher is non-empty", () => {
        const element: CypherCompilable = { getCypher: () => "true" };
        expect(compileCypherIfExists(element, env, { prefix: "WHERE ", suffix: " " })).toBe("WHERE true ");
    });
});
