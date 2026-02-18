/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../../Environment";
import type { Variable } from "../../references/Variable";
import type { Expr } from "../../types";
import { filterTruthy } from "../../utils/filter-truthy";
import { normalizeExpr } from "../../utils/normalize-variable";
import { CypherFunction } from "./CypherFunctions";

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-keys | Cypher Documentation}
 * @group Functions
 * @category List
 */
export function keys(expr: Expr): CypherFunction {
    return new CypherFunction("keys", [expr]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-labels | Cypher Documentation}
 * @group Functions
 * @category List
 */
export function labels(nodeRef: Expr): CypherFunction {
    return new CypherFunction("labels", [nodeRef]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-range | Cypher Documentation}
 * @group Functions
 * @category List
 */
export function range(start: Expr | number, end: Expr | number, step?: Expr | number): CypherFunction {
    const params = filterTruthy([start, end, step]).map(normalizeExpr);
    return new CypherFunction("range", params);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-reverse-list | Cypher Documentation}
 * @group Functions
 * @category List
 */
export function reverse(list: Expr): CypherFunction {
    return new CypherFunction("reverse", [list]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-tail | Cypher Documentation}
 * @group Functions
 * @category List
 */
export function tail(list: Expr): CypherFunction {
    return new CypherFunction("tail", [list]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-tobooleanlist | Cypher Documentation}
 * @group Functions
 * @category List
 */
export function toBooleanList(list: Expr): CypherFunction {
    return new CypherFunction("toBooleanList", [list]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-tofloatlist | Cypher Documentation}
 * @group Functions
 * @category List
 */
export function toFloatList(list: Expr): CypherFunction {
    return new CypherFunction("toFloatList", [list]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-tointegerlist | Cypher Documentation}
 * @group Functions
 * @category List
 */
export function toIntegerList(list: Expr): CypherFunction {
    return new CypherFunction("toIntegerList", [list]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-tostringlist | Cypher Documentation}
 * @group Functions
 * @category List
 */
export function toStringList(list: Expr): CypherFunction {
    return new CypherFunction("toStringList", [list]);
}

/** Reduce a list by executing given expression.
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/list/#functions-reduce | Cypher Documentation}
 * @group Functions
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
    private readonly accVariable: Variable;
    private readonly defaultValue: Expr;
    private readonly variable: Variable;
    private readonly listExpr: Expr;
    private readonly mapExpr: Expr;

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
