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

import type { CypherASTNode } from "../CypherASTNode";
import type { CypherEnvironment } from "../Environment";
import type { Variable } from "../references/Variable";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { padBlock } from "../utils/pad-block";
import { Clause } from "./Clause";
import { WithMatch } from "./mixins/clauses/WithMatch";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithUnwind } from "./mixins/clauses/WithUnwind";
import { WithWith } from "./mixins/clauses/WithWith";
import { ImportWith } from "./sub-clauses/ImportWith";
import { mixin } from "./utils/mixin";

export interface Call extends WithReturn, WithWith, WithUnwind, WithMatch {}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/call-subquery/)
 * @group Clauses
 */
@mixin(WithReturn, WithWith, WithUnwind, WithMatch)
export class Call extends Clause {
    private subQuery: CypherASTNode;
    private importWith: ImportWith | undefined;

    constructor(subQuery: Clause) {
        super();
        const rootQuery = subQuery.getRoot();
        this.addChildren(rootQuery);
        this.subQuery = rootQuery;
    }

    public innerWith(...params: Variable[]): this {
        if (this.importWith) throw new Error("Call import already set");
        if (params.length > 0) {
            this.importWith = new ImportWith(this, [...params]);
            this.addChildren(this.importWith);
        }
        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const subQueryStr = this.subQuery.getCypher(env);
        const innerWithCypher = compileCypherIfExists(this.importWith, env, { suffix: "\n" });
        const inCallBlock = `${innerWithCypher}${subQueryStr}`;

        const nextClause = this.compileNextClause(env);

        return `CALL {\n${padBlock(inCallBlock)}\n}${nextClause}`;
    }
}
