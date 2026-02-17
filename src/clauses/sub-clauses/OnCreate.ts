/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../../Environment";
import type { SetParam } from "./Set";
import { SetClause } from "./Set";

export type OnCreateParam = SetParam;

export class OnCreate extends SetClause {
    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        if (this.params.length === 0) return "";
        const setCypher = super.getCypher(env);
        return `ON CREATE ${setCypher}`;
    }
}
