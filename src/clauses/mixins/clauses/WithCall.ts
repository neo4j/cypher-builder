/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Clause, Variable } from "../../../index";
import { MixinClause } from "../Mixin";

// We need barrel import from Cypher instead of local file to avoid issues with circular dependencies in mixins
import { Call, OptionalCall } from "../../../Cypher";

export abstract class WithCall extends MixinClause {
    /** Add a {@link Call} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/subqueries/call-subquery/ | Cypher Documentation}
     */
    public call(subquery: Clause, variableScope?: Variable[] | "*"): Call {
        const callClause = new Call(subquery, variableScope);
        this.addNextClause(callClause);

        return callClause;
    }

    /** Add a {@link OptionalCall} clause
     */
    public optionalCall(subquery: Clause, variableScope?: Variable[] | "*"): Call {
        const callClause = new OptionalCall(subquery, variableScope);
        this.addNextClause(callClause);

        return callClause;
    }
}
