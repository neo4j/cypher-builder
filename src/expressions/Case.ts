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

import { CypherASTNode } from "../CypherASTNode";
import type { CypherEnvironment } from "../Environment";
import type { Expr, Predicate } from "../types";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { padBlock } from "../utils/pad-block";

/** Case statement
 * @group Expressions
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#query-syntax-case | Cypher Documentation}
 */
export class Case<C extends Expr | undefined = undefined> extends CypherASTNode {
    private readonly comparator: Expr | undefined;
    private readonly whenClauses: When<C>[] = [];
    private default: Expr | undefined;

    constructor(comparator?: C) {
        super();
        this.comparator = comparator;
    }

    // public when(expr: C extends Expr ? Expr : Predicate): When<C> {
    public when(...exprs: C extends Expr ? Expr[] : [Predicate]): When<C> {
        const whenClause = new When(this, exprs);
        this.whenClauses.push(whenClause);
        return whenClause;
    }

    public else(defaultExpr: Expr): this {
        this.default = defaultExpr;
        return this;
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const comparatorStr = compileCypherIfExists(this.comparator, env, { prefix: " " });
        const whenStr = this.whenClauses.map((c) => c.getCypher(env)).join("\n");
        const defaultStr = compileCypherIfExists(this.default, env, { prefix: "\nELSE " });

        const innerStr = padBlock(`${whenStr}${defaultStr}`);

        return `CASE${comparatorStr}\n${innerStr}\nEND`;
    }
}

/**
 * @group Expressions
 */
export class When<T extends Expr | undefined> extends CypherASTNode {
    protected parent: Case<T>;
    private readonly predicates: Expr[];
    private result: Expr | undefined;

    /** @internal */
    constructor(parent: Case<T>, predicate: Expr[]) {
        super(parent);
        this.parent = parent;
        this.predicates = predicate;
    }

    public then(expr: Expr): Case<T> {
        this.result = expr;
        return this.parent;
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const predicateStr = this.predicates.map((p) => p.getCypher(env)).join(", ");
        if (!this.result) throw new Error("Cannot generate CASE ... WHEN statement without THEN");
        const resultStr = this.result.getCypher(env);

        return `WHEN ${predicateStr} THEN ${resultStr}`;
    }
}
