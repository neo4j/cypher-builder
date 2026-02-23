/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherProcedure } from "../../procedures/CypherProcedure.js";

const SCHEMA_NAMESPACE = "db.schema";

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_schema_nodetypeproperties)
 * @group Procedures
 */
export function nodeTypeProperties(): CypherProcedure<
    "nodeType" | "nodeLabels" | "propertyName" | "propertyTypes" | "mandatory"
> {
    return new CypherProcedure("nodeTypeProperties", [], SCHEMA_NAMESPACE);
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_schema_reltypeproperties)
 * @group Procedures
 */
export function relTypeProperties(): CypherProcedure<"relType" | "propertyName" | "propertyTypes" | "mandatory"> {
    return new CypherProcedure("relTypeProperties", [], SCHEMA_NAMESPACE);
}
/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_schema_visualization)
 * @group Procedures
 */
export function visualization(): CypherProcedure<"nodes" | "relationships"> {
    return new CypherProcedure("visualization", [], SCHEMA_NAMESPACE);
}
