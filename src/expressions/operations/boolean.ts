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

import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { Predicate } from "../../types";
import { filterTruthy } from "../../utils/filter-truthy";

type BooleanOperator = "AND" | "NOT" | "OR" | "XOR";

/**
 * @group Operators
 * @category Boolean
 */
export abstract class BooleanOp extends CypherASTNode {
    protected operator: BooleanOperator;

    /** @internal */
    constructor(operator: BooleanOperator) {
        super();
        this.operator = operator;
    }
}

class BinaryOp extends BooleanOp {
    private readonly children: Predicate[];

    /** @internal */
    constructor(operator: BooleanOperator, predicates: Predicate[]) {
        super(operator);
        this.children = predicates;
        this.addChildren(...this.children);
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const childrenStrs = this.children.map((c) => c.getCypher(env)).filter(Boolean);

        if (childrenStrs.length <= 1) {
            throw new Error(`Boolean operation ${this.operator} does not have predicates`);
        }

        const operatorStr = ` ${this.operator} `;
        return `(${childrenStrs.join(operatorStr)})`;
    }
}

class NotOp extends BooleanOp {
    private readonly child: Predicate;

    constructor(child: Predicate) {
        super("NOT");
        this.child = child;
        this.addChildren(this.child);
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const childStr = this.child.getCypher(env);

        // This check is just to avoid double parenthesis (e.g. "NOT ((a AND b))" ), both options are valid cypher
        if (this.child instanceof BinaryOp) {
            return `${this.operator} ${childStr}`;
        }

        return `${this.operator} (${childStr})`;
    }
}

/** Generates an `AND` operator between the given predicates
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-boolean | Cypher Documentation}
 * @group Operators
 * @category Boolean
 * @example
 * ```ts
 * console.log("Test", Cypher.and(
 *     Cypher.eq(new Cypher.Literal("Hi"), new Cypher.Literal("Hi")),
 *     new Cypher.Literal(false)).toString()
 * );
 * ```
 * Translates to
 * ```cypher
 * "Hi" = "Hi" AND false
 * ```
 *
 */
export function and(): undefined;
export function and(left: Predicate, right: Predicate, ...extra: Array<Predicate | undefined>): BooleanOp;
export function and(left: Predicate, ...extra: Array<Predicate | undefined>): Predicate;
export function and(...ops: Array<Predicate | undefined>): Predicate | undefined;
export function and(...ops: Array<Predicate | undefined>): Predicate | undefined {
    const filteredPredicates = filterTruthy(ops);

    if (filteredPredicates[0] && filteredPredicates[1]) {
        return new BinaryOp("AND", filteredPredicates);
    }
    return filteredPredicates[0];
}

/** Generates an `NOT` operator before the given predicate
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-boolean | Cypher Documentation}
 * @group Operators
 * @category Boolean
 * @example
 * ```ts
 * console.log("Test", Cypher.not(
 *     Cypher.eq(new Cypher.Literal("Hi"), new Cypher.Literal("Hi"))
 * );
 * ```
 * Translates to
 * ```cypher
 * NOT "Hi" = "Hi"
 * ```
 *
 */
export function not(child: Predicate): BooleanOp {
    return new NotOp(child);
}

/** Generates an `OR` operator between the given predicates
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-boolean | Cypher Documentation}
 * @group Operators
 * @category Boolean
 * @example
 * ```ts
 * console.log("Test", Cypher.or(
 *     Cypher.eq(new Cypher.Literal("Hi"), new Cypher.Literal("Hi")),
 *     new Cypher.Literal(false)).toString()
 * );
 * ```
 * Translates to
 * ```cypher
 * "Hi" = "Hi" OR false
 * ```
 *
 */
export function or(): undefined;
export function or(left: Predicate, right: Predicate, ...extra: Array<Predicate | undefined>): BooleanOp;
export function or(left: Predicate, ...extra: Array<Predicate | undefined>): Predicate;
export function or(...ops: Array<Predicate | undefined>): Predicate | undefined;
export function or(...ops: Array<Predicate | undefined>): Predicate | undefined {
    const filteredPredicates = filterTruthy(ops);

    if (filteredPredicates[0] && filteredPredicates[1]) {
        return new BinaryOp("OR", filteredPredicates);
    }
    return filteredPredicates[0];
}

/** Generates an `XOR` operator between the given predicates
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-boolean | Cypher Documentation}
 * @group Operators
 * @category Boolean
 * @example
 * ```ts
 * console.log("Test", Cypher.xor(
 *     Cypher.eq(new Cypher.Literal("Hi"), new Cypher.Literal("Hi")),
 *     new Cypher.Literal(false)).toString()
 * );
 * ```
 * Translates to
 * ```cypher
 * "Hi" = "Hi" XOR false
 * ```
 *
 */
export function xor(): undefined;
export function xor(left: Predicate, right: Predicate, ...extra: Array<Predicate | undefined>): BooleanOp;
export function xor(left: Predicate, ...extra: Array<Predicate | undefined>): Predicate;
export function xor(...ops: Array<Predicate | undefined>): Predicate | undefined;
export function xor(...ops: Array<Predicate | undefined>): Predicate | undefined {
    const filteredPredicates = filterTruthy(ops);

    if (filteredPredicates[0] && filteredPredicates[1]) {
        return new BinaryOp("XOR", filteredPredicates);
    }
    return filteredPredicates[0];
}
