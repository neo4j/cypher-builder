/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { ListExpr } from "../expressions/list/ListExpr";
import { MapExpr } from "../expressions/map/MapExpr";
import { Literal } from "../references/Literal";
import type { Variable } from "../references/Variable";
import type { Expr } from "../types";
import { isCypherCompilable } from "./is-cypher-compilable";

/** Something that can be coerced into a Variable */
type VariableLike = string | number | Variable | Literal;

/** Coerces a VariableLike into an Expression. Returns undefined if the value is undefined */
export function normalizeExpr(value: undefined): undefined;
export function normalizeExpr(value: VariableLike | Expr): Expr;
export function normalizeExpr(value: VariableLike | Expr | undefined): Expr | undefined;
export function normalizeExpr(value: VariableLike | Expr | undefined): Expr | undefined {
    if (!value) return undefined;
    if (isCypherCompilable(value)) return value;
    return new Literal(value);
}

export function normalizeMap(map: Record<string, VariableLike>): MapExpr {
    return Object.entries(map).reduce((mapExpr, [key, value]) => {
        mapExpr.set(key, normalizeExpr(value));
        return mapExpr;
    }, new MapExpr());
}

export function normalizeList(list: Array<VariableLike | Expr>): ListExpr {
    const expressions = list.map((v) => normalizeExpr(v));
    return new ListExpr(expressions);
}
