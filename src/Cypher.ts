/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

// Clauses
export { Call, OptionalCall, type CallInTransactionOptions } from "./clauses/Call.js";
export { Create } from "./clauses/Create.js";
export { Finish } from "./clauses/Finish.js";
export { Foreach, type ForeachClauses } from "./clauses/Foreach.js";
export { LoadCSV } from "./clauses/LoadCSV.js";
export { Match, OptionalMatch } from "./clauses/Match.js";
export { Merge } from "./clauses/Merge.js";
export { Raw, type RawCypherContext } from "./clauses/Raw.js";
export { Return } from "./clauses/Return.js";
export { Union } from "./clauses/Union.js";
export { Unwind, type UnwindProjectionColumn } from "./clauses/Unwind.js";
export { Use } from "./clauses/Use.js";
export { With } from "./clauses/With.js";

// Patterns
export { labelExpr } from "./expressions/labels/label-expressions.js";
export type { PartialPattern } from "./pattern/PartialPattern.js";
export { Pattern, type NodePatternOptions, type RelationshipPatternOptions } from "./pattern/Pattern.js";
export { QuantifiedPath } from "./pattern/quantified-patterns/QuantifiedPath.js";
export type { QuantifiedPattern, Quantifier } from "./pattern/quantified-patterns/QuantifiedPattern.js";

// Variables and references
export {
    Literal,
    CypherNull as Null,
    CypherFalse as false,
    CypherTrue as true,
    type LiteralValue,
} from "./references/Literal.js";
export { NamedNode, NodeRef as Node } from "./references/NodeRef.js";
export { NamedParam, Param } from "./references/Param.js";
export { NamedPathVariable, PathVariable } from "./references/Path.js";
export { PropertyRef as Property } from "./references/PropertyRef.js";
export { NamedRelationship, RelationshipRef as Relationship } from "./references/RelationshipRef.js";
export { NamedVariable, Variable } from "./references/Variable.js";

// Expressions
export { Case, type When } from "./expressions/Case.js";
export { CypherTypes as TYPE, isNotType, isType, type IsType, type ListType } from "./expressions/IsType.js";

// Subquery Expressions
export { Collect } from "./expressions/subquery/Collect.js";
export { Count } from "./expressions/subquery/Count.js";
export { Exists } from "./expressions/subquery/Exists.js";

export * as db from "./namespaces/db/db.js";
/**
 * @hideGroups
 */
export * as genai from "./namespaces/genai/genai.js";
export * as tx from "./namespaces/tx.js";
/**
 * @hideGroups
 */
export * as vector from "./namespaces/vector/vector.js";

// --Lists
export { ListComprehension } from "./expressions/list/ListComprehension.js";
export { ListExpr as List } from "./expressions/list/ListExpr.js";
export { listIndex, type ListIndex } from "./expressions/list/ListIndex.js";
export { listRange, type ListRange } from "./expressions/list/ListRange.js";
export { PatternComprehension } from "./expressions/list/PatternComprehension.js";

// --Map
export { MapExpr as Map } from "./expressions/map/MapExpr.js";
export { MapProjection } from "./expressions/map/MapProjection.js";

// --Operations
export { and, not, or, xor, type BooleanOp } from "./expressions/operations/boolean.js";
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
} from "./expressions/operations/comparison.js";
export { ConcatOp, concat } from "./expressions/operations/concat.js";
export { divide, minus, mod, multiply, plus, pow, type MathOp } from "./expressions/operations/math.js";

// --Functions
export { CypherFunction as Function } from "./expressions/functions/CypherFunctions.js";

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
} from "./expressions/functions/aggregation.js";
export * as graph from "./expressions/functions/graph.js";
export * from "./expressions/functions/list.js";
export { file, linenumber } from "./expressions/functions/load-csv.js";
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
} from "./expressions/functions/math.js";
export * from "./expressions/functions/path.js";
export { all, any, exists, isEmpty, none, single } from "./expressions/functions/predicate.js";
export * from "./expressions/functions/scalar.js";
export * from "./expressions/functions/spatial.js";
export * from "./expressions/functions/string.js";
export {
    cypherDate as date,
    cypherDatetime as datetime,
    duration,
    cypherLocalDatetime as localdatetime,
    cypherLocalTime as localtime,
    cypherTime as time,
} from "./expressions/functions/temporal.js";

// Procedures
export { CypherProcedure as Procedure, VoidCypherProcedure as VoidProcedure } from "./procedures/CypherProcedure.js";

// Types
export type { BuildConfig, Clause } from "./clauses/Clause.js";
export type { DeleteInput } from "./clauses/sub-clauses/Delete.js";
export type { Order } from "./clauses/sub-clauses/OrderBy.js";
export type { ProjectionColumn } from "./clauses/sub-clauses/Projection.js";
export type { SetParam } from "./clauses/sub-clauses/Set.js";
export type { CompositeClause } from "./clauses/utils/concat.js";
export type { CypherAggregationFunction as AggregationFunction } from "./expressions/functions/aggregation.js";
export type { ROUND_PRECISION_MODE } from "./expressions/functions/math.js";
export type { PredicateFunction } from "./expressions/functions/predicate.js";
export type { TemporalUnit } from "./expressions/functions/temporal.js";
export type { HasLabel } from "./expressions/HasLabel.js";
export type { LabelExpr, LabelOperator } from "./expressions/labels/label-expressions.js";
export type { PathAssign } from "./pattern/PathAssign.js";
export type { InputArgument } from "./procedures/CypherProcedure.js";
export type { Yield, YieldProjectionColumn } from "./procedures/Yield.js";
export type { Label } from "./references/Label.js";
export type { CypherResult, Expr, NormalizationType, Predicate } from "./types.js";

/**
 * Utility functions
 * @group Utils
 * @hideGroups
 */
export * as utils from "./utils/utils.js";
