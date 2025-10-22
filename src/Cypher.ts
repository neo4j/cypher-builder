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

// Clauses
export { Call, OptionalCall, type CallInTransactionOptions } from "./clauses/Call";
export { Create } from "./clauses/Create";
export { Finish } from "./clauses/Finish";
export { Foreach, type ForeachClauses } from "./clauses/Foreach";
export { LoadCSV } from "./clauses/LoadCSV";
export { Match, OptionalMatch } from "./clauses/Match";
export { Merge } from "./clauses/Merge";
export { Raw, type RawCypherContext } from "./clauses/Raw";
export { Return } from "./clauses/Return";
export { Union } from "./clauses/Union";
export { Unwind, type UnwindProjectionColumn } from "./clauses/Unwind";
export { Use } from "./clauses/Use";
export { With } from "./clauses/With";

// Patterns
export { labelExpr } from "./expressions/labels/label-expressions";
export type { PartialPattern } from "./pattern/PartialPattern";
export { Pattern, type NodePatternOptions, type RelationshipPatternOptions } from "./pattern/Pattern";
export { QuantifiedPath } from "./pattern/quantified-patterns/QuantifiedPath";
export type { QuantifiedPattern, Quantifier } from "./pattern/quantified-patterns/QuantifiedPattern";

// Variables and references
export {
    CypherFalse as false,
    Literal,
    CypherNull as Null,
    CypherTrue as true,
    type LiteralValue,
} from "./references/Literal";
export { NamedNode, NodeRef as Node } from "./references/NodeRef";
export { NamedParam, Param } from "./references/Param";
export { NamedPathVariable, PathVariable } from "./references/Path";
export { PropertyRef as Property } from "./references/PropertyRef";
export { NamedRelationship, RelationshipRef as Relationship } from "./references/RelationshipRef";
export { NamedVariable, Variable } from "./references/Variable";

// Expressions
export { Case, type When } from "./expressions/Case";
export { isNotType, isType, CypherTypes as TYPE, type IsType, type ListType } from "./expressions/IsType";

// Subquery Expressions
export { Collect } from "./expressions/subquery/Collect";
export { Count } from "./expressions/subquery/Count";
export { Exists } from "./expressions/subquery/Exists";

export * as db from "./namespaces/db/db";
/**
 * @hideGroups
 */
export * as genai from "./namespaces/genai/genai";
export * as tx from "./namespaces/tx";
/**
 * @hideGroups
 */
export * as vector from "./namespaces/vector/vector";

// --Lists
export { ListComprehension } from "./expressions/list/ListComprehension";
export { ListExpr as List } from "./expressions/list/ListExpr";
export { listIndex, type ListIndex } from "./expressions/list/ListIndex";
export { PatternComprehension } from "./expressions/list/PatternComprehension";

// --Map
export { MapExpr as Map } from "./expressions/map/MapExpr";
export { MapProjection } from "./expressions/map/MapProjection";

// --Operations
export { and, not, or, xor, type BooleanOp } from "./expressions/operations/boolean";
export {
    contains,
    endsWith,
    eq,
    gt,
    gte,
    inOp as in,
    isNormalized,
    isNotNormalized,
    isNotNull,
    isNull,
    lt,
    lte,
    matches,
    neq,
    startsWith,
    type ComparisonOp,
} from "./expressions/operations/comparison";
export { concat, ConcatOp } from "./expressions/operations/concat";
export { divide, minus, mod, multiply, plus, pow, type MathOp } from "./expressions/operations/math";

// --Functions
export { CypherFunction as Function } from "./expressions/functions/CypherFunctions";

export {
    avg,
    collect,
    count,
    max,
    min,
    percentileCont,
    percentileDisc,
    stDev,
    stDevP,
    sum,
} from "./expressions/functions/aggregation";
export * as graph from "./expressions/functions/graph";
export * from "./expressions/functions/list";
export { file, linenumber } from "./expressions/functions/load-csv";
export {
    abs,
    acos,
    asin,
    atan,
    atan2,
    ceil,
    cos,
    cot,
    degrees,
    e,
    exp,
    floor,
    haversin,
    cypherIsNaN as isNaN,
    log,
    log10,
    pi,
    radians,
    rand,
    round,
    sign,
    sin,
    sqrt,
    tan,
} from "./expressions/functions/math";
export * from "./expressions/functions/path";
export { all, any, exists, isEmpty, none, single } from "./expressions/functions/predicate";
export * from "./expressions/functions/scalar";
export * from "./expressions/functions/spatial";
export * from "./expressions/functions/string";
export {
    cypherDate as date,
    cypherDatetime as datetime,
    duration,
    cypherLocalDatetime as localdatetime,
    cypherLocalTime as localtime,
    cypherTime as time,
} from "./expressions/functions/temporal";

// Procedures
export { CypherProcedure as Procedure, VoidCypherProcedure as VoidProcedure } from "./procedures/CypherProcedure";

// Types
export type { BuildConfig, Clause } from "./clauses/Clause";
export type { DeleteInput } from "./clauses/sub-clauses/Delete";
export type { Order } from "./clauses/sub-clauses/OrderBy";
export type { ProjectionColumn } from "./clauses/sub-clauses/Projection";
export type { SetParam } from "./clauses/sub-clauses/Set";
export type { CompositeClause } from "./clauses/utils/concat";
export type { CypherAggregationFunction as AggregationFunction } from "./expressions/functions/aggregation";
export type { ROUND_PRECISION_MODE } from "./expressions/functions/math";
export type { PredicateFunction } from "./expressions/functions/predicate";
export type { TemporalUnit } from "./expressions/functions/temporal";
export type { HasLabel } from "./expressions/HasLabel";
export type { LabelExpr, LabelOperator } from "./expressions/labels/label-expressions";
export type { PathAssign } from "./pattern/PathAssign";
export type { InputArgument } from "./procedures/CypherProcedure";
export type { Yield, YieldProjectionColumn } from "./procedures/Yield";
export type { Label } from "./references/Label";
export type { CypherResult, Expr, NormalizationType, Predicate } from "./types";

/**
 * Utility functions
 * @group Utils
 * @hideGroups
 */
export * as utils from "./utils/utils";
