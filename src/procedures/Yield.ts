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
import { Clause } from "../clauses/Clause";
import { WithReturn } from "../clauses/mixins/clauses/WithReturn";
import { WithWith } from "../clauses/mixins/clauses/WithWith";
import { WithWhere } from "../clauses/mixins/sub-clauses/WithWhere";
import type { ProjectionColumn } from "../clauses/sub-clauses/Projection";
import { Projection } from "../clauses/sub-clauses/Projection";
import { mixin } from "../clauses/utils/mixin";
import type { Literal } from "../references/Literal";
import type { Variable } from "../references/Variable";
import { NamedVariable } from "../references/Variable";
import type { Expr } from "../types";
import { asArray } from "../utils/as-array";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";

export type YieldProjectionColumn<T extends string> = T | [T, Variable | Literal | string];

export interface Yield extends WithReturn, WithWhere, WithWith {}

/** Yield statement after a Procedure CALL
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/call/#call-call-a-procedure-call-yield-star)
 * @group Procedures
 */
@mixin(WithReturn, WithWhere, WithWith)
export class Yield<T extends string = string> extends Clause {
    private projection: YieldProjection;

    constructor(yieldColumns: Array<YieldProjectionColumn<T>>) {
        super();

        const columns = asArray(yieldColumns);
        this.projection = new YieldProjection(columns);
    }

    public yield(...columns: Array<YieldProjectionColumn<T>>): this {
        this.projection.addYieldColumns(columns);
        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const yieldProjectionStr = this.projection.getCypher(env);

        const whereStr = compileCypherIfExists(this.whereSubClause, env, {
            prefix: "\n",
        });

        const nextClause = this.compileNextClause(env);
        return `YIELD ${yieldProjectionStr}${whereStr}${nextClause}`;
    }
}

export class YieldProjection extends Projection {
    constructor(columns: Array<YieldProjectionColumn<string>>) {
        super([]);
        this.addYieldColumns(columns);
    }

    public addYieldColumns(columns: Array<YieldProjectionColumn<string>>) {
        const parsedColumns = columns.map((c) => this.parseYieldColumn(c));
        this.addColumns(parsedColumns);
    }

    private parseYieldColumn(input: YieldProjectionColumn<string>): "*" | ProjectionColumn {
        if (input === "*") return input;
        if (typeof input === "string") return this.createVariableForStrings(input);
        if (Array.isArray(input)) {
            return [this.createVariableForStrings(input[0]), input[1]];
        }
        return input;
    }

    private createVariableForStrings(rawVar: Expr | string | Variable | Literal): Expr {
        if (typeof rawVar === "string") return new NamedVariable(rawVar);
        return rawVar;
    }
}
