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
import type { CypherCompilable } from "../../types";
import type { Pattern } from "../Pattern";

export type Quantifier =
    | number
    | "*"
    | "+"
    | {
          min?: number;
          max?: number;
      };

/** Represents a quantified path pattern as a {@link Pattern} with at least one relationship and a quantifier of the form `{1,2}`
 * @see {@link https://neo4j.com/docs/cypher-manual/current/patterns/variable-length-patterns/#quantified-path-patterns | Cypher Documentation}
 * @group Patterns
 */
export class QuantifiedPattern implements CypherCompilable {
    private readonly pattern: Pattern;
    private readonly quantifier: Quantifier;

    constructor(pattern: Pattern, quantifier: Quantifier) {
        this.pattern = pattern;
        this.quantifier = quantifier;
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const patternStr = this.pattern.getCypher(env);
        const quantifierStr = this.generateQuantifierStr();

        return `(${patternStr})${quantifierStr}`;
    }

    private generateQuantifierStr(): string {
        if (typeof this.quantifier === "number") {
            return `{${this.quantifier}}`;
        } else if (typeof this.quantifier === "string") {
            return this.quantifier;
        } else {
            return `{${this.quantifier.min ?? ""},${this.quantifier.max ?? ""}}`;
        }
    }
}
