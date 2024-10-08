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

import type { Environment, Expr } from "..";
import { CypherASTNode } from "../CypherASTNode";
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

/**
 * Generates a cypher LIST<...> type
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
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/values-and-types/property-structural-constructed/#types-synonyms)
 */
export const CypherTypes = {
    ...BaseTypes,
    list,
} as const;

/**
 * Type predicate expression
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/values-and-types/type-predicate/)
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
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/values-and-types/type-predicate/#type-predicate-not)
 * @example
 * ```cypher
 * val IS NOT :: INTEGER
 * ```
 */
export function isNotType(expr: Expr, type: Type | Type[]): IsType {
    return new IsType(expr, asArray(type), true);
}

class ListType {
    private types: Type[];
    private _notNull: boolean = false;

    constructor(type: Type[]) {
        this.types = type;
    }

    public notNull(): this {
        this._notNull = true;
        return this;
    }

    public getCypher(env: Environment): string {
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

export class IsType extends CypherASTNode {
    private expr: Expr;
    private types: Type[];
    private not: boolean;
    private _notNull: boolean = false;

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

    public getCypher(env: Environment): string {
        const exprCypher = env.compile(this.expr);
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

type Type = ValueOf<typeof BaseTypes> | ListType;

function compileType(type: Type, env: Environment): string {
    if (type instanceof ListType) {
        return env.compile(type);
    } else {
        return type;
    }
}
