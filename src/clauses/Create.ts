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

import type { CypherEnvironment } from "../Environment";
import { PathAssign } from "../pattern/PathAssign";
import { Pattern } from "../pattern/Pattern";
import type { NodeRef } from "../references/NodeRef";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { Clause } from "./Clause";
import { WithPathAssign } from "./mixins/WithPathAssign";
import { WithFinish } from "./mixins/clauses/WithFinish";
import { WithMerge } from "./mixins/clauses/WithMerge";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithWith } from "./mixins/clauses/WithWith";
import { WithDelete } from "./mixins/sub-clauses/WithDelete";
import { WithOrder } from "./mixins/sub-clauses/WithOrder";
import { WithRemove } from "./mixins/sub-clauses/WithRemove";
import { WithSet } from "./mixins/sub-clauses/WithSet";
import { SetClause } from "./sub-clauses/Set";
import { mixin } from "./utils/mixin";

export interface Create
    extends WithReturn,
        WithSet,
        WithPathAssign,
        WithWith,
        WithDelete,
        WithRemove,
        WithMerge,
        WithFinish,
        WithOrder {}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/create/)
 * @category Clauses
 */
@mixin(WithReturn, WithSet, WithPathAssign, WithWith, WithDelete, WithRemove, WithMerge, WithFinish, WithOrder)
export class Create extends Clause {
    private readonly pattern: Pattern | PathAssign<Pattern>;

    constructor(pattern: Pattern | PathAssign<Pattern>);
    /** @deprecated Use {@link Pattern} instead */
    constructor(pattern: NodeRef | Pattern);
    constructor(pattern: NodeRef | Pattern | PathAssign<Pattern>) {
        super();
        if (pattern instanceof Pattern || pattern instanceof PathAssign) {
            this.pattern = pattern;
        } else {
            this.pattern = new Pattern(pattern);
        }

        this.setSubClause = new SetClause(this);
    }

    /** Add a {@link Create} clause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/create/)
     */
    public create(clause: Create): Create;
    public create(pattern: Pattern): Create;
    /** @deprecated Use {@link Pattern} instead */
    public create(pattern: NodeRef | Pattern): Create;
    public create(clauseOrPattern: Create | NodeRef | Pattern): Create {
        if (clauseOrPattern instanceof Create) {
            this.addNextClause(clauseOrPattern);
            return clauseOrPattern;
        }

        const matchClause = new Create(clauseOrPattern);
        this.addNextClause(matchClause);

        return matchClause;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const pathCypher = this.compilePath(env);
        if (pathCypher && this.pattern instanceof PathAssign) {
            throw new Error(
                "Cannot generate CREATE, using assignTo and assignToPath at the same time is not supported"
            );
        }

        const patternCypher = this.pattern.getCypher(env);

        const setCypher = compileCypherIfExists(this.setSubClause, env, { prefix: "\n" });
        const deleteStr = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const removeCypher = compileCypherIfExists(this.removeClause, env, { prefix: "\n" });
        const orderByCypher = compileCypherIfExists(this.orderByStatement, env, { prefix: "\n" });

        const nextClause = this.compileNextClause(env);
        return `CREATE ${pathCypher}${patternCypher}${setCypher}${removeCypher}${deleteStr}${orderByCypher}${nextClause}`;
    }
}
