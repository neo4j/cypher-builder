/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Pattern } from "..";
import type { CypherEnvironment } from "../Environment";
import type { PathAssign } from "../pattern/PathAssign";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { Clause } from "./Clause";
import { WithCreate } from "./mixins/clauses/WithCreate";
import { WithFinish } from "./mixins/clauses/WithFinish";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithWith } from "./mixins/clauses/WithWith";
import { WithDelete } from "./mixins/sub-clauses/WithDelete";
import { WithOrder } from "./mixins/sub-clauses/WithOrder";
import { WithSetRemove } from "./mixins/sub-clauses/WithSetRemove";
import type { OnCreateParam } from "./sub-clauses/OnCreate";
import { OnCreate } from "./sub-clauses/OnCreate";
import { OnMatch } from "./sub-clauses/OnMatch";
import { mixin } from "./utils/mixin";

export interface Merge extends WithReturn, WithSetRemove, WithDelete, WithWith, WithCreate, WithFinish, WithOrder {}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/merge/)
 * @category Clauses
 */
@mixin(WithReturn, WithSetRemove, WithDelete, WithWith, WithCreate, WithFinish, WithOrder)
export class Merge extends Clause {
    private readonly pattern: Pattern | PathAssign<Pattern>;
    private readonly onCreateClause: OnCreate;
    private readonly onMatchClause: OnMatch;

    constructor(pattern: Pattern | PathAssign<Pattern>) {
        super();

        this.pattern = pattern;
        this.onCreateClause = new OnCreate(this);
        this.onMatchClause = new OnMatch(this);
    }

    public onCreateSet(...onCreateParams: OnCreateParam[]): this {
        this.onCreateClause.addParams(...onCreateParams);
        return this;
    }

    public onMatchSet(...onMatchParams: OnCreateParam[]): this {
        this.onMatchClause.addParams(...onMatchParams);
        return this;
    }

    /** Add a {@link Merge} clause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/merge/)
     */
    public merge(clauseOrPattern: Merge | Pattern): Merge {
        if (clauseOrPattern instanceof Merge) {
            this.addNextClause(clauseOrPattern);
            return clauseOrPattern;
        }

        const matchClause = new Merge(clauseOrPattern);
        this.addNextClause(matchClause);

        return matchClause;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const mergeStr = `MERGE ${this.pattern.getCypher(env)}`;
        const setCypher = this.compileSetCypher(env);
        const onCreateCypher = compileCypherIfExists(this.onCreateClause, env, { prefix: "\n" });
        const onMatchCypher = compileCypherIfExists(this.onMatchClause, env, { prefix: "\n" });
        const deleteCypher = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const orderCypher = compileCypherIfExists(this.orderByStatement, env, { prefix: "\n" });
        const nextClause = this.compileNextClause(env);

        return `${mergeStr}${onMatchCypher}${onCreateCypher}${setCypher}${deleteCypher}${orderCypher}${nextClause}`;
    }
}
