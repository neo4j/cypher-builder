/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";
import { TestClause } from "../../utils/TestClause";

describe("apoc.date", () => {
    test("convertFormat", () => {
        const convertFormat = Cypher.apoc.date.convertFormat(
            new Cypher.Variable(),
            "iso_zoned_date_time",
            "iso_offset_date_time"
        );

        const queryResult = new TestClause(convertFormat).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"apoc.date.convertFormat(toString(var0), \\"iso_zoned_date_time\\", \\"iso_offset_date_time\\")"`
        );

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
    test("convertFormat with expression", () => {
        const convertFormat = Cypher.apoc.date.convertFormat(
            Cypher.max(new Cypher.Variable()),
            "iso_zoned_date_time",
            "iso_offset_date_time"
        );

        const queryResult = new TestClause(convertFormat).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"apoc.date.convertFormat(toString(max(var0)), \\"iso_zoned_date_time\\", \\"iso_offset_date_time\\")"`
        );

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("convertFormat with default convertTo", () => {
        const convertFormat = Cypher.apoc.date.convertFormat(new Cypher.Variable(), "iso_zoned_date_time");

        const queryResult = new TestClause(convertFormat).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"apoc.date.convertFormat(toString(var0), \\"iso_zoned_date_time\\", \\"yyyy-MM-dd\\")"`
        );

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
