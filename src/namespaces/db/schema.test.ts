/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../index.js";

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
