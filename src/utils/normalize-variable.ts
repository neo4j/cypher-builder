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

import { ListExpr } from "../expressions/list/ListExpr";
import { MapExpr } from "../expressions/map/MapExpr";
import { Literal } from "../references/Literal";
import type { Param } from "../references/Param";
import type { Variable } from "../references/Variable";
import type { Expr } from "../types";
import { isCypherCompilable } from "./is-cypher-compilable";

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
