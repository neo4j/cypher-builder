/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment";
import { Clause } from "./Clause";
import { WithNext } from "./mixins/clauses/WithNext";
import { mixin } from "./utils/mixin";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Finish extends WithNext {}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/finish/ | Cypher Documentation}
 * @group Clauses
 * @since Neo4j 5.19
 */
@mixin(WithNext)
export class Finish extends Clause {
    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const nextClause = this.compileNextClause(env);
        return `FINISH${nextClause}`;
    }
}
