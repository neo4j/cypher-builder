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
import { Union } from "./Union";
import { WithCreate } from "./mixins/clauses/WithCreate";
import { WithMatch } from "./mixins/clauses/WithMatch";
import { WithMerge } from "./mixins/clauses/WithMerge";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithUnwind } from "./mixins/clauses/WithUnwind";
import { WithWith } from "./mixins/clauses/WithWith";
import { WithDelete } from "./mixins/sub-clauses/WithDelete";
import { WithRemove } from "./mixins/sub-clauses/WithRemove";
import { WithSet } from "./mixins/sub-clauses/WithSet";
import { ImportWith } from "./sub-clauses/ImportWith";
import { CompositeClause } from "./utils/concat";
import { mixin } from "./utils/mixin";

export interface Call
    extends WithReturn,
        WithWith,
        WithUnwind,
        WithSet,
        WithRemove,
        WithDelete,
        WithMatch,
        WithCreate,
        WithMerge {}

type InTransactionConfig = {
    ofRows?: number;
    onError?: "continue" | "break" | "fail";
    concurrentTransactions?: number;
};

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/call-subquery/)
 * @category Clauses
 */
@mixin(WithReturn, WithWith, WithUnwind, WithRemove, WithDelete, WithSet, WithMatch, WithCreate, WithMerge)
export class Call extends Clause {
    private subquery: CypherASTNode;
    private _importWith?: ImportWith;
    private inTransactionsConfig?: InTransactionConfig;

    // This is to preserve compatibility with innerWith and avoid breaking changes
    // Remove on 2.0.0
    private _usingImportWith = false;

    constructor(subquery: Clause) {
        super();
        const rootQuery = subquery.getRoot();
        this.addChildren(rootQuery);
        this.subquery = rootQuery;
    }

    /** Adds a `WITH` statement inside `CALL {`, this `WITH` can is used to import variables outside of the subquery
     *  @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/subqueries/call-subquery/#call-importing-variables)
     */
    public importWith(...params: Array<Variable | "*">): this {
        if (this._importWith) throw new Error("Call import already set");
        if (params.length > 0) {
            this._importWith = new ImportWith(this, [...params]);
            this.addChildren(this._importWith);
            this._usingImportWith = true;
        }
        return this;
    }

    public inTransactions(config: InTransactionConfig = {}): this {
        this.inTransactionsConfig = config;
        return this;
    }

    /** @deprecated Use {@link importWith} instead */
    public innerWith(...params: Array<Variable | "*">): this {
        if (this._importWith) throw new Error("Call import already set");
        if (params.length > 0) {
            this._importWith = new ImportWith(this, [...params]);
            this.addChildren(this._importWith);
        }
        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const importWithCypher = compileCypherIfExists(this._importWith, env, { suffix: "\n" });

        const subQueryStr = this.getSubqueryCypher(env, importWithCypher);

        const removeCypher = compileCypherIfExists(this.removeClause, env, { prefix: "\n" });
        const deleteCypher = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const setCypher = compileCypherIfExists(this.setSubClause, env, { prefix: "\n" });
        const inTransactionCypher = this.generateInTransactionStr();

        const inCallBlock = `${importWithCypher}${subQueryStr}`;
        const nextClause = this.compileNextClause(env);

        return `CALL {\n${padBlock(inCallBlock)}\n}${inTransactionCypher}${setCypher}${removeCypher}${deleteCypher}${nextClause}`;
    }

    private getSubqueryCypher(env: CypherEnvironment, importWithCypher: string | undefined): string {
        // This ensures the import with is added to all the union subqueries
        if (this._usingImportWith && (this.subquery instanceof Union || this.subquery instanceof CompositeClause)) {
            //TODO: try to embed the importWithCypher in the environment for a more generic solution
            return this.subquery.getCypher(env, importWithCypher);
        }
        return this.subquery.getCypher(env);
    }

    private generateInTransactionStr(): string {
        if (!this.inTransactionsConfig) {
            return "";
        }

        const rows = this.inTransactionsConfig.ofRows;
        const error = this.inTransactionsConfig.onError;
        const ofRowsStr = rows ? ` OF ${rows} ROWS` : "";
        const onErrorStr = error ? ` ON ERROR ${this.getOnErrorStr(error)}` : "";

        const concurrentTransactions = this.inTransactionsConfig.concurrentTransactions;
        const concurrentTransactionsStr =
            typeof concurrentTransactions === "number" ? ` ${concurrentTransactions} CONCURRENT` : "";

        return ` IN${concurrentTransactionsStr} TRANSACTIONS${ofRowsStr}${onErrorStr}`;
    }

    private getOnErrorStr(err: "continue" | "break" | "fail"): "CONTINUE" | "BREAK" | "FAIL" {
        const errorMap = {
            continue: "CONTINUE",
            break: "BREAK",
            fail: "FAIL",
        } as const;

        if (!errorMap[err]) {
            throw new Error(`Incorrect ON ERROR option ${err}`);
        }
        return errorMap[err];
    }
}
