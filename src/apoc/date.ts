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

import Cypher from "..";
import { CypherFunction } from "../expressions/functions/CypherFunctions";
import type { PropertyRef } from "../references/PropertyRef";
import type { Variable } from "../references/Variable";

/**
 * @group Cypher Functions
 * @see [Apoc Documentation](https://neo4j.com/docs/apoc/current/overview/apoc.date/apoc.date.convertFormat/)
 * @example
 * ```ts
 * Cypher.apoc.date.convertFormat(
 *  new Cypher.Param("2020-11-04"),
 *  "date",
 *  "basic_date"
 * )
 *```
 */
export function convertFormat(
    temporalParam: Variable | PropertyRef,
    currentFormat: string,
    convertTo = "yyyy-MM-dd"
): CypherFunction {
    return new CypherFunction("apoc.date.convertFormat", [
        Cypher.toString(temporalParam),
        new Cypher.Literal(currentFormat),
        new Cypher.Literal(convertTo),
    ]);
}
