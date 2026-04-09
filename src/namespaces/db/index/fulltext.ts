/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { InputArgument } from "../../../procedures/CypherProcedure";
import { CypherProcedure, VoidCypherProcedure } from "../../../procedures/CypherProcedure";
import type { Literal } from "../../../references/Literal";
import type { Param } from "../../../references/Param";
import type { Variable } from "../../../references/Variable";
import type { Expr } from "../../../types";
import { normalizeMap, normalizeVariable } from "../../../utils/normalize-variable";

type FulltextPhrase = string | Literal<string> | Param | Variable;

const FULLTEXT_NAMESPACE = "db.index.fulltext";

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_index_fulltext_querynodes)
 * @group Procedures
 */
export function queryNodes(
    indexName: string | Literal<string>,
    queryString: string | Literal<string> | Param | Variable,
    options?: { skip?: InputArgument<number>; limit?: InputArgument<number>; analyser?: InputArgument<string> }
): CypherProcedure<"node" | "score"> {
    const procedureArgs = getFulltextArguments(indexName, queryString, options);

    return new CypherProcedure("queryNodes", procedureArgs, FULLTEXT_NAMESPACE);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_index_fulltext_queryrelationships)
 * @group Procedures
 */
export function queryRelationships(
    indexName: string | Literal<string>,
    queryString: string | Literal<string> | Param | Variable,
    options?: { skip?: InputArgument<number>; limit?: InputArgument<number>; analyser?: InputArgument<string> }
): CypherProcedure<"relationship" | "score"> {
    const procedureArgs = getFulltextArguments(indexName, queryString, options);

    return new CypherProcedure("queryRelationships", procedureArgs, FULLTEXT_NAMESPACE);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_index_fulltext_awaiteventuallyconsistentindexrefresh)
 * @group Procedures
 */
export function awaitEventuallyConsistentIndexRefresh(): VoidCypherProcedure {
    return new VoidCypherProcedure("awaitEventuallyConsistentIndexRefresh", [], FULLTEXT_NAMESPACE);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_index_fulltext_listavailableanalyzers)
 * @group Procedures
 */
export function listAvailableAnalyzers(): CypherProcedure<"analyzer" | "description" | "stopwords"> {
    return new CypherProcedure("queryRelationships", [], FULLTEXT_NAMESPACE);
}

function getFulltextArguments(
    indexName: string | Literal<string>,
    queryString: FulltextPhrase,
    options?: { skip?: InputArgument<number>; limit?: InputArgument<number>; analyser?: InputArgument<string> }
): Expr[] {
    const phraseVar = normalizeVariable(queryString);
    const indexNameVar = normalizeVariable(indexName);

    const procedureArgs: Expr[] = [indexNameVar, phraseVar];
    if (options) {
        const optionsMap = normalizeMap(options);
        procedureArgs.push(optionsMap);
    }
    return procedureArgs;
}
