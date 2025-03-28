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
import type { Expr } from "../../types";

type MathOperator = "+" | "-" | "*" | "/" | "%" | "^";

/**
 * @group Operators
 * @category Math
 */
export class MathOp extends CypherASTNode {
    private readonly operator: MathOperator;
    private readonly exprs: Expr[];

    /** @internal */
    constructor(operator: MathOperator, exprs: Expr[]) {
        super();
        this.operator = operator;
        this.exprs = exprs;
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const exprs = this.exprs.map((e) => e.getCypher(env));

        const operatorStr = ` ${this.operator} `;
        return `(${exprs.join(operatorStr)})`;
    }
}

function createOp(op: MathOperator, exprs: Expr[]): MathOp {
    return new MathOp(op, exprs);
}

/** Plus (+) operator. This operator may be used for addition operations between numbers or for string concatenation.
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-mathematical | Cypher Documentation}
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/operators/#syntax-concatenating-two-strings | String Concatenation}
 * @group Operators
 * @category Math
 */
export function plus(leftExpr: Expr, rightExpr: Expr): MathOp;
export function plus(...exprs: Expr[]): MathOp;
export function plus(...exprs: Expr[]): MathOp {
    return createOp("+", exprs);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-mathematical | Cypher Documentation}
 * @group Operators
 * @category Math
 */
export function minus(leftExpr: Expr, rightExpr: Expr): MathOp {
    return createOp("-", [leftExpr, rightExpr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-mathematical | Cypher Documentation}
 * @group Operators
 * @category Math
 */
export function multiply(leftExpr: Expr, rightExpr: Expr): MathOp {
    return createOp("*", [leftExpr, rightExpr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-mathematical | Cypher Documentation}
 * @group Operators
 * @category Math
 */
export function divide(leftExpr: Expr, rightExpr: Expr): MathOp {
    return createOp("/", [leftExpr, rightExpr]);
}

/** Modulus (%) operator
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-mathematical | Cypher Documentation}
 * @group Operators
 * @category Math
 */
export function mod(leftExpr: Expr, rightExpr: Expr): MathOp {
    return createOp("%", [leftExpr, rightExpr]);
}

/** Power (^) operator
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/operators/#query-operators-mathematical | Cypher Documentation}
 * @group Operators
 * @category Math
 */
export function pow(leftExpr: Expr, rightExpr: Expr): MathOp {
    return createOp("^", [leftExpr, rightExpr]);
}
