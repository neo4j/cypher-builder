/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { ListExpr } from "../expressions/list/ListExpr.js";
import { MapExpr } from "../expressions/map/MapExpr.js";
import { Literal } from "../references/Literal.js";
import type { Param } from "../references/Param.js";
import type { Variable } from "../references/Variable.js";
import type { Expr } from "../types.js";
import { isCypherCompilable } from "./is-cypher-compilable.js";

type VariableInput = string | number | Variable | Literal | Param;

export function normalizeVariable(value: VariableInput): Variable | Literal | Param {
    if (isCypherCompilable(value)) return value;
    return new Literal(value);
}

// Same as normalizeVariable, just typings are different
export function normalizeExpr(value: VariableInput | Expr): Variable | Literal | Param | Expr {
    if (isCypherCompilable(value)) return value;
    return new Literal(value);
}

export function normalizeMap(map: Record<string, VariableInput>): MapExpr {
    return Object.entries(map).reduce((mapExpr, [key, value]) => {
        mapExpr.set(key, normalizeVariable(value));
        return mapExpr;
    }, new MapExpr());
}

export function normalizeList(list: Array<VariableInput | Expr>): ListExpr {
    const expressions = list.map((v) => normalizeExpr(v));
    return new ListExpr(expressions);
}
