/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "..";
import { TestClause } from "../utils/TestClause";
import { HasLabel } from "./HasLabel";

describe("HasLabel", () => {
    test("Fails if no labels are provided", () => {
        const node = new Cypher.Node();
        expect(() => {
            new HasLabel(node, []);
        }).toThrow();
    });

    describe("node.hasLabel", () => {
        test("Filtering with HasLabel", () => {
            const node = new Cypher.Node();
            const query = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).where(
                node.hasLabel("Movie")
            );

            const queryResult = new TestClause(query).build();

            expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            WHERE this0:Movie"
        `);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Filtering with multiple labels", () => {
            const node = new Cypher.Node();
            const query = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).where(
                node.hasLabels("Movie", "Film")
            );

            const queryResult = new TestClause(query).build();

            expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            WHERE this0:Movie:Film"
        `);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("HasLabel with label expression &", () => {
            const node = new Cypher.Node();
            const query = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).where(
                node.hasLabel(Cypher.labelExpr.and("Movie", "Film"))
            );

            const queryResult = new TestClause(query).build();

            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE this0:(Movie&Film)"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
        test("HasLabel with label expression |", () => {
            const node = new Cypher.Node();
            const query = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).where(
                node.hasLabel(Cypher.labelExpr.or("Movie", "Film"))
            );

            const queryResult = new TestClause(query).build();

            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE this0:(Movie|Film)"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("relationship.hasType", () => {
        test("Filtering with hasType", () => {
            const node = new Cypher.Node();
            const relationship = new Cypher.Relationship();
            const query = new Cypher.Match(
                new Cypher.Pattern(node, { labels: ["Movie"] }).related(relationship).to()
            ).where(relationship.hasType("ACTED_IN"));

            const queryResult = new TestClause(query).build();

            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)-[this1]->()
WHERE this1:ACTED_IN"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("HasType with label expression |", () => {
            const node = new Cypher.Node();
            const relationship = new Cypher.Relationship();
            const query = new Cypher.Match(
                new Cypher.Pattern(node, { labels: ["Movie"] }).related(relationship, { type: "ACTED_IN" }).to()
            ).where(relationship.hasType(Cypher.labelExpr.or("ACTED_IN", "STARRED_IN")));

            const queryResult = new TestClause(query).build();

            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)-[this1:ACTED_IN]->()
WHERE this1:(ACTED_IN|STARRED_IN)"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });
});
