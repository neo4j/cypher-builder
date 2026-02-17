/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../../Environment";
import { SetClause } from "./Set";

export class OnMatch extends SetClause {
    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        if (this.params.length === 0) return "";
        const setCypher = super.getCypher(env);
        return `ON MATCH ${setCypher}`;
    }
}
