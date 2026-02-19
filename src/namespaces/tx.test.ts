/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../index.js";

describe("tx procedures", () => {
    test("tx.getMetaData", () => {
        const query = Cypher.tx.getMetaData().yield("metadata");
        const { cypher } = query.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL tx.getMetaData() YIELD metadata"`);
    });
    test("tx.setMetadata", () => {
        const query = Cypher.tx.setMetaData({
            test: "dsa",
            test2: new Cypher.Param("dsa2"),
        });
        const { cypher } = query.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL tx.setMetaData({test: 'dsa', test2: $param0})"`);
    });
});
