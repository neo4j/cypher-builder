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

import type { Variable } from "..";
import type { CypherEnvironment } from "../Environment";
import { Clause } from "./Clause";
import { WithCallProcedure } from "./mixins/clauses/WithCallProcedure";
import { WithCreate } from "./mixins/clauses/WithCreate";
import { WithMerge } from "./mixins/clauses/WithMerge";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithWith } from "./mixins/clauses/WithWith";
import { WithWhere } from "./mixins/sub-clauses/WithWhere";
import { mixin } from "./utils/mixin";

export interface LoadCSV extends WithReturn, WithCreate, WithMerge, WithWith, WithWhere, WithCallProcedure {}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/load-csv/ | Cypher Documentation}
 * @category Clauses
 */
@mixin(WithReturn, WithCreate, WithMerge, WithWith, WithWhere, WithCallProcedure)
export class LoadCSV extends Clause {
    private readonly url: string;
    private readonly alias: Variable;

    private _withHeaders = false;

    constructor(url: string, alias: Variable) {
        super();
        this.url = url;
        this.alias = alias;
    }

    public withHeaders(): this {
        this._withHeaders = true;
        return this;
    }

    /**
     *  @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const aliasStr = this.alias.getCypher(env);
        const nextClause = this.compileNextClause(env);
        const withHeadersStr = this._withHeaders ? "WITH HEADERS " : "";
        return `LOAD CSV ${withHeadersStr}FROM "${this.url}" AS ${aliasStr}${nextClause}`;
    }
}
