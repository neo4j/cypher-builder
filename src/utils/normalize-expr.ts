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

/** Coerces a {@link VariableLike} into an Expression. Returns undefined if the value is undefined */
export function normalizeExpr(value: undefined): undefined;
export function normalizeExpr(value: VariableLike | Expr): Expr;
export function normalizeExpr(value: VariableLike | Expr | undefined): Expr | undefined;
export function normalizeExpr(value: VariableLike | Expr | undefined): Expr | undefined {
    if (!value) return undefined;
    if (isCypherCompilable(value)) return value;
    return new Literal(value);
}

/** Applies {@link normalizeExpr} to the properties of a map. Returns a {@link MapExpr} */
export function normalizeMap(map: Record<string, VariableLike | Expr>): MapExpr {
    return Object.entries(map).reduce((mapExpr, [key, value]) => {
        mapExpr.set(key, normalizeExpr(value));
        return mapExpr;
    }, new MapExpr());
}

/** Applies {@link normalizeExpr} to the elements of a list. Returns a {@link ListExpr} */
export function normalizeList(list: Array<VariableLike | Expr>): ListExpr {
    const expressions = list.map((v) => normalizeExpr(v));
    return new ListExpr(expressions);
}
