/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherProcedure } from "../../procedures/CypherProcedure";
import type { Expr } from "../../types";
import { normalizeExpr, normalizeList } from "../../utils/normalize-variable";

const CDC_NAMESPACE = "db.cdc";

/** Acquire a change identifier for the last committed transaction
 * @see [Neo4j Documentation](https://neo4j.com/docs/cdc/current/procedures/current/)
 * @group Procedures
 */
export function current(): CypherProcedure<"id"> {
    return new CypherProcedure("current", [], CDC_NAMESPACE);
}

/** Acquire a change identifier for the earliest available change
 * @see [Neo4j Documentation](https://neo4j.com/docs/cdc/current/procedures/earliest/)
 * @group Procedures
 */
export function earliest(): CypherProcedure<"id"> {
    return new CypherProcedure("earliest", [], CDC_NAMESPACE);
}

/** Query the database for captured changes
 * @see [Neo4j Documentation](https://neo4j.com/docs/cdc/current/procedures/query/)
 * @group Procedures
 */
export function query(
    from: string | Expr,
    selectors: Array<Expr> = []
): CypherProcedure<"id" | "txId" | "seq" | "metadata" | "event"> {
    const fromExpr = normalizeExpr(from);
    const selectorsExpr = normalizeList(selectors);
    return new CypherProcedure("query", [fromExpr, selectorsExpr], CDC_NAMESPACE);
}
