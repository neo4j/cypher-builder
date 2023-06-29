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

import type { Expr } from "../../types";
import type { CypherEnvironment } from "../../Environment";
import { CypherASTNode } from "../../CypherASTNode";

type ComparisonOperator =
    | "="
    | "<"
    | ">"
    | "<>"
    | "<="
    | ">="
    | "IS NULL"
    | "IS NOT NULL"
    | "IN"
    | "CONTAINS"
    | "STARTS WITH"
    | "ENDS WITH"
    | "=~";

/**
 *  @group Internal
 */
export class ComparisonOp extends CypherASTNode {
    private operator: ComparisonOperator;
    private leftExpr: Expr;
    private rightExpr: Expr | undefined;

    constructor(operator: ComparisonOperator, left: Expr, right: Expr | undefined) {
        super();
        this.operator = operator;
        this.leftExpr = left;
        this.rightExpr = right;
    }

    /**
     * @hidden
     */
    public getCypher(env: CypherEnvironment): string {
        const leftStr = `${this.leftExpr.getCypher(env)} `;
        const rightStr = this.rightExpr ? ` ${this.rightExpr.getCypher(env)}` : "";

        return `${leftStr}${this.operator}${rightStr}`;
    }
}

function createOp(op: ComparisonOperator, leftExpr: Expr, rightExpr?: Expr): ComparisonOp {
    return new ComparisonOp(op, leftExpr, rightExpr);
}

/** Equality (=) operator
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Operators
 * @category Comparison
 */
export function eq(leftExpr: Expr, rightExpr: Expr): ComparisonOp {
    return createOp("=", leftExpr, rightExpr);
}

/** Inequality (<>) operator
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Operators
 * @category Comparison
 */
export function neq(leftExpr: Expr, rightExpr: Expr): ComparisonOp {
    return createOp("<>", leftExpr, rightExpr);
}

/** Greater Than (>) operator
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Operators
 * @category Comparison
 */
export function gt(leftExpr: Expr, rightExpr: Expr): ComparisonOp {
    return createOp(">", leftExpr, rightExpr);
}

/** Greater Than Equal (>=) operator
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Operators
 * @category Comparison
 */
export function gte(leftExpr: Expr, rightExpr: Expr): ComparisonOp {
    return createOp(">=", leftExpr, rightExpr);
}

/** Less Than (<) operator
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Operators
 * @category Comparison
 */
export function lt(leftExpr: Expr, rightExpr: Expr): ComparisonOp {
    return createOp("<", leftExpr, rightExpr);
}

/** Less Than Equal (<=) operator
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Operators
 * @category Comparison
 */
export function lte(leftExpr: Expr, rightExpr: Expr): ComparisonOp {
    return createOp("<=", leftExpr, rightExpr);
}

/** `IS NULL` operator
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Operators
 * @category Comparison
 * @example
 * ```cypher
 * this0.title IS NULL
 * ```
 */
export function isNull(childExpr: Expr): ComparisonOp {
    return createOp("IS NULL", childExpr);
}

/** `IS NOT NULL` operator
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Operators
 * @category Comparison
 * @example
 * ```cypher
 * this0.title IS NULL
 * ```
 */
export function isNotNull(childExpr: Expr): ComparisonOp {
    return createOp("IS NOT NULL", childExpr);
}

/** `IN` operator
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Operators
 * @category Comparison
 */
export function inOp(leftExpr: Expr, rightExpr: Expr): ComparisonOp {
    return createOp("IN", leftExpr, rightExpr);
}

/** `CONTAINS` operator
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Operators
 * @category Comparison
 */
export function contains(leftExpr: Expr, rightExpr: Expr): ComparisonOp {
    return createOp("CONTAINS", leftExpr, rightExpr);
}

/** `STARTS WITH` operator
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Operators
 * @category Comparison
 */
export function startsWith(leftExpr: Expr, rightExpr: Expr): ComparisonOp {
    return createOp("STARTS WITH", leftExpr, rightExpr);
}

/** `ENDS WITH` operator
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Operators
 * @category Comparison
 */
export function endsWith(leftExpr: Expr, rightExpr: Expr): ComparisonOp {
    return createOp("ENDS WITH", leftExpr, rightExpr);
}

/** Matching (=~) operator.
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-comparison)
 * @group Operators
 * @category Comparison
 */
export function matches(leftExpr: Expr, rightExpr: Expr): ComparisonOp {
    return createOp("=~", leftExpr, rightExpr);
}
