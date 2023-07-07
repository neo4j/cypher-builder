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

import type { Variable } from "../..";
import type { CypherEnvironment } from "../../Environment";
import type { Expr } from "../../types";
import { filterTruthy } from "../../utils/filter-truthy";
import { normalizeExpr } from "../../utils/normalize-variable";
import { CypherFunction } from "./CypherFunctions";

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-keys)
 * @group Cypher Functions
 * @category List
 */
export function keys(expr: Expr): CypherFunction {
    return new CypherFunction("keys", [expr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-labels)
 * @group Cypher Functions
 * @category List
 */
export function labels(nodeRef: Expr): CypherFunction {
    return new CypherFunction("labels", [nodeRef]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-range)
 * @group Cypher Functions
 * @category List
 */
export function range(start: Expr | number, end: Expr | number, step?: Expr | number): CypherFunction {
    const params = filterTruthy([start, end, step]).map(normalizeExpr);
    return new CypherFunction("range", params);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-reverse-list)
 * @group Cypher Functions
 * @category List
 */
export function reverse(list: Expr): CypherFunction {
    return new CypherFunction("reverse", [list]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-tail)
 * @group Cypher Functions
 * @category List
 */
export function tail(list: Expr): CypherFunction {
    return new CypherFunction("tail", [list]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-tobooleanlist)
 * @group Cypher Functions
 * @category List
 */
export function toBooleanList(list: Expr): CypherFunction {
    return new CypherFunction("toBooleanList", [list]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-tofloatlist)
 * @group Cypher Functions
 * @category List
 */
export function toFloatList(list: Expr): CypherFunction {
    return new CypherFunction("toFloatList", [list]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-tointegerlist)
 * @group Cypher Functions
 * @category List
 */
export function toIntegerList(list: Expr): CypherFunction {
    return new CypherFunction("toIntegerList", [list]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-tostringlist)
 * @group Cypher Functions
 * @category List
 */
export function toStringList(list: Expr): CypherFunction {
    return new CypherFunction("toStringList", [list]);
}

/** Reduce a list by executing given expression.
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-reduce)
 * @group Cypher Functions
 * @category List
 * @example
 * ```ts
 * Cypher.reduce(totalAge, new Cypher.Literal(0), n, Cypher.nodes(p), Cypher.plus(totalAge, n.property("age")));
 * ```
 * _Cypher:_
 * ```cypher
 * reduce(totalAge = 0, n IN nodes(p) | totalAge + n.age)
 * ```
 */
export function reduce(
    accVariable: Variable,
    defaultValue: Expr,
    variable: Variable,
    listExpr: Expr,
    mapExpr: Expr
): CypherFunction {
    return new ReducerFunction({
        accVariable,
        defaultValue,
        variable,
        listExpr,
        mapExpr,
    });
}

class ReducerFunction extends CypherFunction {
    private accVariable: Variable;
    private defaultValue: Expr;
    private variable: Variable;
    private listExpr: Expr;
    private mapExpr: Expr;

    constructor({
        accVariable,
        defaultValue,
        variable,
        listExpr,
        mapExpr,
    }: {
        accVariable: Variable;
        defaultValue: Expr;
        variable: Variable;
        listExpr: Expr;
        mapExpr: Expr;
    }) {
        super("reduce");
        this.accVariable = accVariable;
        this.defaultValue = defaultValue;
        this.variable = variable;
        this.listExpr = listExpr;
        this.mapExpr = mapExpr;
    }

    getCypher(env: CypherEnvironment): string {
        const accStr = `${this.accVariable.getCypher(env)} = ${this.defaultValue.getCypher(env)}`;

        const variableStr = this.variable.getCypher(env);
        const listExprStr = this.listExpr.getCypher(env);
        const mapExprStr = this.mapExpr.getCypher(env);

        return `${this.name}(${accStr}, ${variableStr} IN ${listExprStr} | ${mapExprStr})`;
    }
}
