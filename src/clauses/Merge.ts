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
import { Pattern } from "../pattern/Pattern";
import type { NodeRef } from "../references/NodeRef";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { Clause } from "./Clause";
import { WithPathAssign } from "./mixins/WithPathAssign";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithWith } from "./mixins/clauses/WithWith";
import { WithDelete } from "./mixins/sub-clauses/WithDelete";
import { WithSet } from "./mixins/sub-clauses/WithSet";
import type { OnCreateParam } from "./sub-clauses/OnCreate";
import { OnCreate } from "./sub-clauses/OnCreate";
import { mixin } from "./utils/mixin";

export interface Merge extends WithReturn, WithSet, WithPathAssign, WithDelete, WithWith {}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/merge/)
 * @group Clauses
 */
@mixin(WithReturn, WithSet, WithPathAssign, WithDelete, WithWith)
export class Merge extends Clause {
    private pattern: Pattern;
    private onCreateClause: OnCreate;

    constructor(pattern: NodeRef | Pattern) {
        super();

        if (pattern instanceof Pattern) {
            this.pattern = pattern;
        } else {
            this.pattern = new Pattern(pattern);
        }

        this.onCreateClause = new OnCreate(this);
    }

    public onCreate(...onCreateParams: OnCreateParam[]): this {
        this.onCreateClause.addParams(...onCreateParams);

        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const pathAssignStr = this.compilePath(env);

        const mergeStr = `MERGE ${pathAssignStr}${this.pattern.getCypher(env)}`;
        const setCypher = compileCypherIfExists(this.setSubClause, env, { prefix: "\n" });
        const onCreateStr = compileCypherIfExists(this.onCreateClause, env, { prefix: "\n" });
        const deleteStr = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const nextClause = this.compileNextClause(env);

        return `${mergeStr}${setCypher}${onCreateStr}${deleteStr}${nextClause}`;
    }
}
