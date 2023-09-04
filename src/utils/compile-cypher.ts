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

import type { CypherEnvironment } from "../Environment";
import type { Clause } from "../clauses/Clause";
import type { Expr } from "../types";
import { isCypherCompilable } from "./is-cypher-compilable";

/** Compiles a clause or expression to a Cypher string, adding optional prefix or suffix. To be used in a RawCypher callback
 *
 *  The prefix and suffix will only be added if the resulting Cypher is **not** an empty string
 * @deprecated Use `env.compile` in a RawCypher callback instead
 */
export function compileCypher(
    element: Expr | Clause,
    env: CypherEnvironment,
    { prefix = "", suffix = "" }: { prefix?: string; suffix?: string } = {}
): string {
    if (!isCypherCompilable(element)) throw new Error("Invalid element, missing `getCypher` method");
    if (!env) throw new Error("Missing env when compiling Cypher");
    const cypher = element.getCypher(env);
    if (!cypher) return "";
    return `${prefix}${cypher}${suffix}`;
}
