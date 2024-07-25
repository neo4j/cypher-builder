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

import type { VoidCypherProcedure } from "../procedures/CypherProcedure";
import { CypherProcedure } from "../procedures/CypherProcedure";
import type { Literal } from "../references/Literal";
import type { Param } from "../references/Param";
import { normalizeMap } from "../utils/normalize-variable";

const TX_NAMESPACE = "tx";

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_tx_getmetadata)
 * @group Procedures
 */
export function getMetaData(): CypherProcedure<"metadata"> {
    return new CypherProcedure("getMetaData", [], TX_NAMESPACE);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_tx_setmetadata)
 * @group Procedures
 */
export function setMetaData(data: Record<string, string | number | Literal | Param>): VoidCypherProcedure {
    return new CypherProcedure("setMetaData", [normalizeMap(data)], TX_NAMESPACE);
}
