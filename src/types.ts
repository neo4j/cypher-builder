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

import type { CypherEnvironment } from "./Environment";
import type { Raw } from "./clauses/Raw";
import type { Case } from "./expressions/Case";
import type { HasLabel } from "./expressions/HasLabel";
import type { IsTypeExpr } from "./expressions/IsType";
import type { CypherFunction } from "./expressions/functions/CypherFunctions";
import type { PredicateFunction } from "./expressions/functions/predicate";
import type { ListComprehension } from "./expressions/list/ListComprehension";
import type { ListExpr } from "./expressions/list/ListExpr";
import type { ListIndex } from "./expressions/list/ListIndex";
import type { PatternComprehension } from "./expressions/list/PatternComprehension";
import type { MapExpr } from "./expressions/map/MapExpr";
import type { MapProjection } from "./expressions/map/MapProjection";
import type { BooleanOp } from "./expressions/operations/boolean";
import type { ComparisonOp } from "./expressions/operations/comparison";
import type { MathOp } from "./expressions/operations/math";
import type { Collect } from "./expressions/subquery/Collect";
import type { Count } from "./expressions/subquery/Count";
import type { Exists } from "./expressions/subquery/Exists";
import type { Literal } from "./references/Literal";
import type { PropertyRef } from "./references/PropertyRef";
import type { Variable } from "./references/Variable";

export type Operation = BooleanOp | ComparisonOp | MathOp;

/** Represents a Cypher Expression
 *  @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/expressions/ | Cypher Documentation}
 */
export type Expr =
    | Operation
    | Variable
    | Literal
    | PropertyRef
    | CypherFunction
    | Predicate
    | ListComprehension
    | PatternComprehension
    | MapExpr // NOTE this cannot be set as a property in a node
    | MapProjection // NOTE this cannot be set as a property in a node
    | ListExpr
    | ListIndex
    | Case<ComparisonOp>
    | Collect;

/** Represents a predicate statement (i.e returns a boolean). Note that Raw is only added for compatibility */
export type Predicate =
    | BooleanOp
    | ComparisonOp
    | Raw
    | Exists
    | Count
    | PredicateFunction
    | Literal<boolean>
    | Case
    | HasLabel
    | IsTypeExpr;

export type CypherResult = {
    cypher: string;
    params: Record<string, unknown>;
};

export type NormalizationType = "NFC" | "NFD" | "NFKC" | "NFKD";

/** Defines the interface for a class that can be compiled into Cypher */
export interface CypherCompilable {
    getCypher(env: CypherEnvironment): string;
}
