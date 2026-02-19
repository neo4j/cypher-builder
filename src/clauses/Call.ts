/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherASTNode } from "../CypherASTNode.js";
import type { CypherEnvironment } from "../Environment.js";
import type { Variable } from "../references/Variable.js";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists.js";
import { isNumber } from "../utils/is-number.js";
import { padBlock } from "../utils/pad-block.js";
import { Clause } from "./Clause.js";
import { WithCreate } from "./mixins/clauses/WithCreate.js";
import { WithMatch } from "./mixins/clauses/WithMatch.js";
import { WithMerge } from "./mixins/clauses/WithMerge.js";
import { WithReturn } from "./mixins/clauses/WithReturn.js";
import { WithUnwind } from "./mixins/clauses/WithUnwind.js";
import { WithWith } from "./mixins/clauses/WithWith.js";
import { WithDelete } from "./mixins/sub-clauses/WithDelete.js";
import { WithOrder } from "./mixins/sub-clauses/WithOrder.js";
import { WithSetRemove } from "./mixins/sub-clauses/WithSetRemove.js";
import { mixin } from "./utils/mixin.js";

export interface Call
    extends WithReturn, WithWith, WithUnwind, WithSetRemove, WithDelete, WithMatch, WithCreate, WithMerge, WithOrder {}

/** @group Subqueries */
export type CallInTransactionOptions = {
    ofRows?: number;
    onError?: "continue" | "break" | "fail";
    concurrentTransactions?: number;
    /** Adds `ON ERROR RETRY`, if using number, it will generate `ON ERROR RETRY FOR x SECONDS`
     * @since Neo4j 2025.03
     */
    retry?: number | boolean;
};

/** Adds a `CALL` subquery
 * @param subquery - A clause to be wrapped in a `CALL` clause
 * @param variableScope - A list of variables to pass to the scope of the clause: `CALL (var0) {`
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/call-subquery/ | Cypher Documentation}
 * @group Subqueries
 */
@mixin(WithReturn, WithWith, WithUnwind, WithDelete, WithSetRemove, WithMatch, WithCreate, WithMerge, WithOrder)
export class Call extends Clause {
    private readonly subquery: CypherASTNode;
    private inTransactionsConfig?: CallInTransactionOptions;
    private readonly variableScope?: Variable[] | "*";
    private _optional: boolean = false;

    constructor(subquery: Clause, variableScope?: Variable[] | "*") {
        super();
        const rootQuery = subquery.getRoot();
        this.addChildren(rootQuery);
        this.subquery = rootQuery;
        this.variableScope = variableScope;
    }

    public inTransactions(config: CallInTransactionOptions = {}): this {
        this.inTransactionsConfig = config;
        return this;
    }

    /** Makes the subquery an OPTIONAL CALL
     * @see {@link https://neo4j.com/docs/cypher-manual/current/subqueries/call-subquery/#optional-call | Cypher Documentation}
     * @since Neo4j 5.24
     */
    public optional(): this {
        this._optional = true;
        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const subQueryStr = this.subquery.getCypher(env);

        const setCypher = this.compileSetCypher(env);
        const deleteCypher = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const orderByCypher = compileCypherIfExists(this.orderByStatement, env, { prefix: "\n" });
        const inTransactionCypher = this.generateInTransactionsStr();

        const variableScopeStr = this.generateVariableScopeStr(env);
        const nextClause = this.compileNextClause(env);

        const optionalStr = this._optional ? "OPTIONAL " : "";

        return `${optionalStr}CALL${variableScopeStr} {\n${padBlock(subQueryStr)}\n}${inTransactionCypher}${setCypher}${deleteCypher}${orderByCypher}${nextClause}`;
    }

    private generateVariableScopeStr(env: CypherEnvironment): string {
        if (!this.variableScope) {
            return "";
        }

        if (this.variableScope === "*") {
            return ` (*)`;
        }

        const variablesString = this.variableScope.map((variable) => variable.getCypher(env));
        return ` (${variablesString.join(", ")})`;
    }

    private generateInTransactionsStr(): string {
        if (!this.inTransactionsConfig) {
            return "";
        }

        const rows = this.inTransactionsConfig.ofRows;
        const error = this.inTransactionsConfig.onError;
        const ofRowsStr = rows ? ` OF ${rows} ROWS` : "";

        let onErrorStr = "";
        if (this.inTransactionsConfig.retry !== undefined && this.inTransactionsConfig.retry !== false) {
            onErrorStr = this.generateRetryErrorStr(this.inTransactionsConfig);
        } else if (error) {
            onErrorStr = ` ON ERROR ${this.getOnErrorStr(error)}`;
        }

        const concurrentTransactions = this.inTransactionsConfig.concurrentTransactions;
        const concurrentTransactionsStr =
            typeof concurrentTransactions === "number" ? ` ${concurrentTransactions} CONCURRENT` : "";

        return ` IN${concurrentTransactionsStr} TRANSACTIONS${ofRowsStr}${onErrorStr}`;
    }

    private generateRetryErrorStr(transactionConfig: CallInTransactionOptions) {
        const error = transactionConfig.onError;
        const hasTime = isNumber(transactionConfig.retry);

        const thenStr = error ? ` THEN ${this.getOnErrorStr(error)}` : "";
        const timeStr = hasTime ? ` FOR ${transactionConfig.retry} SECONDS` : "";
        return ` ON ERROR RETRY${timeStr}${thenStr}`;
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

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/subqueries/call-subquery/#optional-call | Cypher Documentation}
 * @group Subqueries
 * @since Neo4j 5.24
 */
export class OptionalCall extends Call {
    constructor(subquery: Clause, variableScope?: Variable[] | "*") {
        super(subquery, variableScope);
        this.optional();
    }
}
