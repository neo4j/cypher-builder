/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherFunction } from "../../expressions/functions/CypherFunctions";
import type { ListExpr as List } from "../../expressions/list/ListExpr";
import type { MapExpr as Map } from "../../expressions/map/MapExpr";
import { VoidCypherProcedure } from "../../procedures/CypherProcedure";
import { Literal } from "../../references/Literal";
import type { Predicate } from "../../types";
import { normalizeVariable } from "../../utils/normalize-variable";

/**
 * @group Procedures
 * @deprecated apoc methods will no longer be supported in Cypher Builder version 3
 * @see [Apoc Documentation](https://neo4j.com/docs/apoc/current/overview/apoc.util/apoc.util.validate/)
 */
export function validate(
    predicate: Predicate,
    message: string | Literal<string>,
    params: List | Literal | Map = new Literal([0])
): VoidCypherProcedure {
    const messageVar = normalizeVariable(message);
    return new VoidCypherProcedure("apoc.util.validate", [predicate, messageVar, params]);
}

/**
 * @group Functions
 * @deprecated apoc methods will no longer be supported in Cypher Builder version 3
 * @see [Apoc Documentation](https://neo4j.com/docs/apoc/current/overview/apoc.util/apoc.util.validatePredicate/)
 */
export function validatePredicate(predicate: Predicate, message: string): CypherFunction {
    const defaultParam = new Literal([0]);

    return new CypherFunction("apoc.util.validatePredicate", [predicate, new Literal(message), defaultParam]);
}
