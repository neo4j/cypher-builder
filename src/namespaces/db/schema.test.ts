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

import Cypher from "../../index";

describe("db.schema procedures", () => {
    test("db.schema.nodeTypeProperties", () => {
        const query = Cypher.db.schema
            .nodeTypeProperties()
            .yield("nodeLabels", "nodeType", "propertyName", "propertyTypes", "mandatory");
        const { cypher } = query.build();

        expect(cypher).toMatchInlineSnapshot(
            `"CALL db.schema.nodeTypeProperties() YIELD nodeLabels, nodeType, propertyName, propertyTypes, mandatory"`
        );
    });

    test("db.schema.relTypeProperties", () => {
        const query = Cypher.db.schema
            .relTypeProperties()
            .yield("relType", "propertyName", "propertyTypes", "mandatory");
        const { cypher } = query.build();

        expect(cypher).toMatchInlineSnapshot(
            `"CALL db.schema.relTypeProperties() YIELD relType, propertyName, propertyTypes, mandatory"`
        );
    });
    test("db.schema.visualization", () => {
        const query = Cypher.db.schema.visualization().yield("nodes", "relationships");
        const { cypher } = query.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL db.schema.visualization() YIELD nodes, relationships"`);
    });
});
