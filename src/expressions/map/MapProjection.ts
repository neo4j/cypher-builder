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

import type { CypherEnvironment } from "../../Environment";
import type { Variable } from "../../references/Variable";
import type { CypherCompilable, Expr } from "../../types";
import { escapeProperty } from "../../utils/escape";
import { isString } from "../../utils/is-string";
import { serializeMap } from "../../utils/serialize-map";
import { MapExpr } from "./MapExpr";

/** Represents a Map projection
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/maps/#cypher-map-projection | Cypher Documentation}
 * @group Maps
 * @example
 * ```cypher
 * this { .title }
 * ```
 */

export class MapProjection implements CypherCompilable {
    private readonly extraValues: Map<string, Expr> = new Map();
    private readonly variable: Variable;
    private readonly projection: string[];

    private readonly isStar: boolean = false;

    constructor(variable: Variable, projection: "*" | string[] = [], extraValues: Record<string, Expr> = {}) {
        this.variable = variable;
        if (projection === "*") {
            this.isStar = true;
            this.projection = [];
        } else {
            this.projection = projection;
        }
        this.setExtraValues(extraValues);
    }

    public set(values: Record<string, Expr> | string): void {
        if (isString(values)) {
            this.projection.push(values);
        } else {
            this.setExtraValues(values);
        }
    }

    /** Converts the Map projection expression into a normal Map expression
     * @example
     * Converts
     * ```cypher
     * this { .title }
     * ```
     * into:
     * ```cypher
     * { title: this.title }
     * ```
     */
    public toMap(): MapExpr {
        const projectionFields = this.projection.reduce((acc: Record<string, Expr>, field) => {
            acc[field] = this.variable.property(field);
            return acc;
        }, {});

        return new MapExpr({
            ...projectionFields,
            ...Object.fromEntries(this.extraValues),
        });
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const variableStr = this.variable.getCypher(env);
        const extraValuesStr = serializeMap(env, this.extraValues, true);

        const escapedColumns = this.projection.map((p) => `.${escapeProperty(p)}`);
        if (this.isStar) {
            escapedColumns.unshift(".*");
        }

        const projectionStr = escapedColumns.join(", ");

        const commaStr = extraValuesStr && projectionStr ? ", " : "";

        return `${variableStr} { ${projectionStr}${commaStr}${extraValuesStr} }`;
    }

    private setExtraValues(values: Record<string, Expr>): void {
        Object.entries(values).forEach(([key, value]) => {
            if (!value) throw new Error(`Missing value on map key ${key}`);
            this.extraValues.set(key, value);
        });
    }
}
