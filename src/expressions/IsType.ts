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

import { CypherASTNode } from "../CypherASTNode";
import type { CypherEnvironment } from "../Environment";
import type { Expr } from "../types";
import { asArray } from "../utils/as-array";
import type { ValueOf } from "../utils/type-helpers";

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
 * @see {@link https://neo4j.com/docs/cypher-manual/current/values-and-types/type-predicate/ | Cypher Documentation}
 * @example
 * ```cypher
 * val IS :: INTEGER
 * ```
 */
export function isType(expr: Expr, type: Type | Type[]): IsTypeExpr {
    return new IsTypeExpr(expr, asArray(type));
}

/**
 * Type predicate expression with NOT
 * @see {@link https://neo4j.com/docs/cypher-manual/current/values-and-types/type-predicate/#type-predicate-not | Cypher Documentation}
 * @example
 * ```cypher
 * val IS NOT :: INTEGER
 * ```
 */
export function isNotType(expr: Expr, type: Type | Type[]): IsTypeExpr {
    return new IsTypeExpr(expr, asArray(type), true);
}

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

/** @deprecated Use {@link IsTypeExpr} instead */
export type IsType = IsTypeExpr;

export class IsTypeExpr extends CypherASTNode {
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
