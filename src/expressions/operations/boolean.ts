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
 *  @group Internal
 */
export abstract class BooleanOp extends CypherASTNode {
    protected operator: BooleanOperator;

    constructor(operator: BooleanOperator) {
        super();
        this.operator = operator;
    }
}

class BinaryOp extends BooleanOp {
    private children: Predicate[];

    constructor(operator: BooleanOperator, predicates: Predicate[]) {
        super(operator);
        this.children = [...predicates];
        this.addChildren(...this.children);
    }

    /**
     * @hidden
     */
    public getCypher(env: CypherEnvironment): string {
        const childrenStrs = this.children.map((c) => c.getCypher(env)).filter(Boolean);

        if (childrenStrs.length <= 1) {
            return childrenStrs.join("");
        }

        const operatorStr = ` ${this.operator} `;
        return `(${childrenStrs.join(operatorStr)})`;
    }
}

class NotOp extends BooleanOp {
    private child: Predicate;

    constructor(child: Predicate) {
        super("NOT");
        this.child = child;
        this.addChildren(this.child);
    }

    /**
     * @hidden
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

/** Generates an `NOT` operator before the given predicate
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-boolean)
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

/** Generates an `AND` operator between the given predicates
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-boolean)
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
export function and(...ops: Array<Predicate | undefined>): Predicate {
    const filteredPredicates = filterTruthy(ops);

    // Small optimization on the resulting tree by removing binary operations if they are actually unary
    if (filteredPredicates.length === 1) {
        return filteredPredicates[0]!;
    }

    return new BinaryOp("AND", filteredPredicates);
}

/** Generates an `OR` operator between the given predicates
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-boolean)
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

export function or(...ops: Array<Predicate | undefined>): Predicate {
    const filteredPredicates = filterTruthy(ops);

    // Small optimization on the resulting tree by removing binary operations if they are actually unary
    if (filteredPredicates.length === 1) {
        return filteredPredicates[0]!;
    }

    return new BinaryOp("OR", filteredPredicates);
}

/** Generates an `XOR` operator between the given predicates
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-boolean)
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
export function xor(...ops: Array<Predicate | undefined>): Predicate {
    const filteredPredicates = filterTruthy(ops);

    // Small optimization on the resulting tree by removing binary operations if they are actually unary
    if (filteredPredicates.length === 1) {
        return filteredPredicates[0]!;
    }

    return new BinaryOp("XOR", filteredPredicates);
}
