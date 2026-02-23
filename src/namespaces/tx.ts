/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { VoidCypherProcedure } from "../procedures/CypherProcedure.js";
import { CypherProcedure } from "../procedures/CypherProcedure.js";
import type { Literal } from "../references/Literal.js";
import type { Param } from "../references/Param.js";
import { normalizeMap } from "../utils/normalize-variable.js";

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
