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
import type { CypherCompilable, Expr } from "../../types";

/**
 * @group Lists
 */
export class ListRange implements CypherCompilable {
    private readonly value: Expr;
    private readonly from: number;
    private readonly to: number;

    /**
     * @internal
     */
    constructor(variable: Expr, from: number, to: number) {
        this.value = variable;
        this.from = from;
        this.to = to;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        return `${this.value.getCypher(env)}[${this.from}..${this.to}]`;
    }
}

/** Adds a list range operator (`[ .. ]`) to an expression
 * @example
 * ```cypher
 * collect(var)[1..2]
 * ```
 */
export function listRange(expr: Expr, from: number, to: number): ListRange {
    return new ListRange(expr, from, to);
}
