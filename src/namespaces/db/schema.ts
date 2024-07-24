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

import { CypherProcedure } from "../../procedures/CypherProcedure";

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_schema_nodetypeproperties)
 * @group Procedures
 */
export function nodeTypeProperties(): CypherProcedure<
    "nodeType" | "nodeLabels" | "propertyName" | "propertyTypes" | "mandatory"
> {
    return new CypherProcedure("db.schema.nodeTypeProperties");
}

/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_schema_reltypeproperties)
 * @group Procedures
 */
export function relTypeProperties(): CypherProcedure<"relType" | "propertyName" | "propertyTypes" | "mandatory"> {
    return new CypherProcedure("db.schema.relTypeProperties");
}
/**
 * @see [Neo4j Documentation](https://neo4j.com/docs/operations-manual/current/reference/procedures/#procedure_db_schema_visualization)
 * @group Procedures
 */
export function visualization(): CypherProcedure<"nodes" | "relationships"> {
    return new CypherProcedure("db.schema.visualization");
}
