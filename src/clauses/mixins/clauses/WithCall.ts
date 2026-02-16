/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Clause, Variable } from "../../..";
import { Call, OptionalCall } from "../../..";
import { MixinClause } from "../Mixin";

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
