/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { ConcatOp } from "./index.js";
import type { CypherEnvironment } from "./Environment.js";
import type { Raw } from "./clauses/Raw.js";
import type { Case } from "./expressions/Case.js";
import type { HasLabel } from "./expressions/HasLabel.js";
import type { IsType } from "./expressions/IsType.js";
import type { CypherFunction } from "./expressions/functions/CypherFunctions.js";
import type { PredicateFunction } from "./expressions/functions/predicate.js";
import type { ListComprehension } from "./expressions/list/ListComprehension.js";
import type { ListExpr } from "./expressions/list/ListExpr.js";
import type { ListIndex } from "./expressions/list/ListIndex.js";
import type { PatternComprehension } from "./expressions/list/PatternComprehension.js";
import type { MapExpr } from "./expressions/map/MapExpr.js";
import type { MapProjection } from "./expressions/map/MapProjection.js";
import type { BooleanOp } from "./expressions/operations/boolean.js";
import type { ComparisonOp } from "./expressions/operations/comparison.js";
import type { MathOp } from "./expressions/operations/math.js";
import type { Collect } from "./expressions/subquery/Collect.js";
import type { Count } from "./expressions/subquery/Count.js";
import type { Exists } from "./expressions/subquery/Exists.js";
import type { Literal } from "./references/Literal.js";
import type { PropertyRef } from "./references/PropertyRef.js";
import type { Variable } from "./references/Variable.js";

/** Represents a Cypher Expression
 * @group Expressions
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/expressions/ | Cypher Documentation}
 */
export type Expr =
    | MathOp
    | ConcatOp
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
    | Collect;

/** Represents a predicate expression (i.e returns a boolean). Note that {@link Raw} is only added for compatibility
 *  @group Expressions
 */
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
    | IsType;

/** @group Utils */
export type CypherResult = {
    cypher: string;
    params: Record<string, unknown>;
};

/**
 * @group Operators
 * @category Comparison
 */
export type NormalizationType = "NFC" | "NFD" | "NFKC" | "NFKD";

/** Defines the interface for a class that can be compiled into Cypher */
export interface CypherCompilable {
    getCypher(env: CypherEnvironment): string;
}
