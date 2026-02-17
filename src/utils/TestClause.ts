/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { Clause } from "../clauses/Clause";
import type { CypherEnvironment } from "../Environment";
import type { CypherCompilable } from "../types";

/** For testing purposes only */
export class TestClause extends Clause {
    private readonly children: CypherCompilable[];

    constructor(...children: CypherCompilable[]) {
        super();
        this.children = children;
    }

    public getCypher(env: CypherEnvironment): string {
        return this.children.map((c) => c.getCypher(env)).join("");
    }
}
