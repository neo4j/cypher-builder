/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherASTNode } from "../CypherASTNode.js";
import type { CypherEnvironment } from "../Environment.js";
import type { Expr } from "../types.js";
import { asArray } from "../utils/as-array.js";
import type { ValueOf } from "../utils/type-helpers.js";

const BaseTypes = {
    ANY: "ANY",
    BOOLEAN: "BOOLEAN",
    DATE: "DATE",
    DURATION: "DURATION",
    FLOAT: "FLOAT",
    INTEGER: "INTEGER",
    LOCAL_DATETIME: "LOCAL DATETIME",
    LOCAL_TIME: "LOCAL_TIME",
    MAP: "MAP",
    NODE: "NODE",
    NOTHING: "NOTHING",
    NULL: "NULL",
    PATH: "PATH",
    POINT: "POINT",
    PROPERTY_VALUE: "PROPERTY VALUE",
    RELATIONSHIP: "RELATIONSHIP",
    STRING: "STRING",
    ZONED_DATETIME: "ZONED DATETIME",
    ZONED_TIME: "ZONED TIME",
    TIMESTAMP_WITHOUT_TIME_ZONE: "TIMESTAMP WITHOUT TIME ZONE",
    TIME_WITHOUT_TIME_ZONE: "TIME WITHOUT TIME ZONE",
    TIMESTAMP_WITH_TIME_ZONE: "TIMESTAMP WITH TIME ZONE",
    TIME_WITH_TIME_ZONE: "TIME WITH TIME ZONE",
} as const;

/**
 * @inline
 */
type Type = ValueOf<typeof BaseTypes> | ListType;

/**
 * Generates a cypher `LIST<...>` type
 * @example
 * ```cypher
 * LIST<STRING>
 * ```
 */
function list(type: Type | Type[]): ListType {
    return new ListType(asArray(type));
}

/**
 * Types supported by Neo4j
 * @see {@link https://neo4j.com/docs/cypher-manual/current/values-and-types/property-structural-constructed/#types-synonyms | Cypher Documentation}
 */
export const CypherTypes = {
    ...BaseTypes,
    list,
} as const;

/**
 * Type predicate expression
 * @group Expressions
 * @see {@link https://neo4j.com/docs/cypher-manual/current/values-and-types/type-predicate/ | Cypher Documentation}
 * @example
 * ```cypher
 * val IS :: INTEGER
 * ```
 */
export function isType(expr: Expr, type: Type | Type[]): IsType {
    return new IsType(expr, asArray(type));
}

/**
 * Type predicate expression with NOT
 * @group Expressions
 * @see {@link https://neo4j.com/docs/cypher-manual/current/values-and-types/type-predicate/#type-predicate-not | Cypher Documentation}
 * @example
 * ```cypher
 * val IS NOT :: INTEGER
 * ```
 */
export function isNotType(expr: Expr, type: Type | Type[]): IsType {
    return new IsType(expr, asArray(type), true);
}

/**
 * @group Expressions
 */
export class ListType {
    private readonly types: Type[];
    private _notNull: boolean = false;

    /** @internal */
    constructor(type: Type[]) {
        this.types = type;
    }

    public notNull(): this {
        this._notNull = true;
        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        // Note that all types must be nullable or non nullable
        const notNullStr = this._notNull ? " NOT NULL" : "";
        const typesStr = this.types
            .map((type) => {
                const typeStr = compileType(type, env);

                return `${typeStr}${notNullStr}`;
            })
            .join(" | ");

        return `LIST<${typesStr}>`;
    }
}

/**
 * @group Expressions
 */
export class IsType extends CypherASTNode {
    private readonly expr: Expr;
    private readonly types: Type[];
    private readonly not: boolean;
    private _notNull: boolean = false;

    /** @internal */
    public constructor(expr: Expr, type: Type[], not = false) {
        super();
        this.expr = expr;
        this.types = type;
        this.not = not;
    }

    public notNull(): this {
        this._notNull = true;
        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const exprCypher = this.expr.getCypher(env);
        const isStr = this.not ? "IS NOT" : "IS";

        // Note that all types must be nullable or non nullable
        const notNullStr = this._notNull ? " NOT NULL" : "";
        const typesStr = this.types
            .map((type) => {
                const typeStr = compileType(type, env);

                return `${typeStr}${notNullStr}`;
            })
            .join(" | ");

        return `${exprCypher} ${isStr} :: ${typesStr}`;
    }
}

function compileType(type: Type, env: CypherEnvironment): string {
    if (type instanceof ListType) {
        return type.getCypher(env);
    } else {
        return type;
    }
}
