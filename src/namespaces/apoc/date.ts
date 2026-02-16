/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherFunction } from "../../expressions/functions/CypherFunctions";
import { toString } from "../../expressions/functions/string";
import { Literal } from "../../references/Literal";
import type { Expr } from "../../types";

/**
 * @group Functions
 * @see [Apoc Documentation](https://neo4j.com/docs/apoc/current/overview/apoc.date/apoc.date.convertFormat/)
 * @deprecated apoc methods will no longer be supported in Cypher Builder version 3
 * @example
 * ```ts
 * Cypher.apoc.date.convertFormat(
 *  new Cypher.Param("2020-11-04"),
 *  "date",
 *  "basic_date"
 * )
 *```
 */
export function convertFormat(temporalParam: Expr, currentFormat: string, convertTo = "yyyy-MM-dd"): CypherFunction {
    return new CypherFunction("apoc.date.convertFormat", [
        toString(temporalParam), // NOTE: should this be `toString` by default?
        new Literal(currentFormat),
        new Literal(convertTo),
    ]);
}
