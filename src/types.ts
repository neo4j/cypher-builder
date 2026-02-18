/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { ConcatOp } from ".";
import type { CypherEnvironment } from "./Environment";
import type { Raw } from "./clauses/Raw";
import type { Case } from "./expressions/Case";
import type { HasLabel } from "./expressions/HasLabel";
import type { IsType } from "./expressions/IsType";
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
