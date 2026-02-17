/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";
describe("apoc.util", () => {
    describe("Validate", () => {
        test("Simple Validate", () => {
            const validate = Cypher.apoc.util.validate(
                Cypher.eq(new Cypher.Literal(1), new Cypher.Literal(2)),
                "That's not how math works"
            );
            expect(validate.build().cypher).toMatchInlineSnapshot(
                `"CALL apoc.util.validate(1 = 2, \\"That's not how math works\\", [0])"`
            );
        });
    });

    describe("ValidatePredicate", () => {
        test("Simple validatePredicate", () => {
            const node = new Cypher.Node();
            const validatePredicate = Cypher.apoc.util.validatePredicate(
                Cypher.eq(new Cypher.Literal(1), new Cypher.Literal(2)),
                "That's not how math works"
            );

            const query = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] }));
            query.where(validatePredicate).return(node);

            const { cypher, params } = query.build();
            expect(cypher).toMatchInlineSnapshot(`
                "MATCH (this0:Movie)
                WHERE apoc.util.validatePredicate(1 = 2, \\"That's not how math works\\", [0])
                RETURN this0"
            `);
            expect(params).toMatchInlineSnapshot(`{}`);
        });
    });
});
