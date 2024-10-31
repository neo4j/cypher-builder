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
import type { PathVariable } from "../../references/Path";
import type { CypherCompilable } from "../../types";
import { padBlock } from "../../utils/pad-block";
import { PathAssign } from "../PathAssign";
import type { Pattern } from "../Pattern";
import type { QuantifiedPattern } from "./QuantifiedPattern";

export class QuantifiedPath implements CypherCompilable {
    private readonly patterns: Array<QuantifiedPattern | Pattern> = [];

    constructor(...patterns: Array<QuantifiedPattern | Pattern>) {
        this.patterns = patterns;
    }

    public assignTo(variable: PathVariable): PathAssign<this> {
        return new PathAssign(this, variable);
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const patternsStrings = this.patterns.map((pattern) => {
            return pattern.getCypher(env);
        });

        const firstPattern = patternsStrings.shift() ?? "";

        if (patternsStrings.length > 0) {
            const remainingPatternsString = this.getRemainingPatternsString(patternsStrings);
            return `${firstPattern}\n${remainingPatternsString}`;
        }

        return firstPattern;
    }

    private getRemainingPatternsString(patternStrings: string[]): string {
        const remainingPatternsStr = patternStrings.join("\n");
        return padBlock(remainingPatternsStr, 6);
    }
}
