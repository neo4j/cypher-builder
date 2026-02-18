/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";
import { TestClause } from "../../utils/TestClause";

describe("Label Expressions", () => {
    describe("node", () => {
        test("Simple label expression: &", () => {
            const labelExpr = Cypher.labelExpr.and("A", "B");
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: labelExpr });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:(A&B))`);
        });

        test("Simple label expression: |", () => {
            const labelExpr = Cypher.labelExpr.or("A", "B");
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: labelExpr });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:(A|B))`);
        });

        test("Multiple labels with expression: &", () => {
            const labelExpr = Cypher.labelExpr.and(...["A", "B", "C"]);
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: labelExpr });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:(A&B&C))`);
        });

        test("Multiple labels with expression: |", () => {
            const labelExpr = Cypher.labelExpr.or(...["A", "B", "C"]);
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: labelExpr });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:(A|B|C))`);
        });

        test("No labels with expression: &", () => {
            const labelExpr = Cypher.labelExpr.and();
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: labelExpr });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)`);
        });

        test("No labels with expression: |", () => {
            const labelExpr = Cypher.labelExpr.or();
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: labelExpr });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)`);
        });

        test("Simple label expression: !", () => {
            const labelExpr = Cypher.labelExpr.not("A");
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: labelExpr });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:!A)`);
        });

        test("Label wildcard", () => {
            const labelExpr = Cypher.labelExpr.wildcard;
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: labelExpr });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:%)`);
        });

        test("Nested label expressions", () => {
            const labelExpr = Cypher.labelExpr.and(
                Cypher.labelExpr.and("A", "B"),
                Cypher.labelExpr.not(Cypher.labelExpr.or("B", Cypher.labelExpr.wildcard))
            );

            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: labelExpr });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:((A&B)&!(B|%)))`);
        });

        test("Not Not expression", () => {
            const labelExpr = Cypher.labelExpr.not(Cypher.labelExpr.not("A"));

            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: labelExpr });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:!!A)`);
        });

        test("Wildcard with escaped label", () => {
            const labelExpr = Cypher.labelExpr.and(Cypher.labelExpr.wildcard, "%");

            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: labelExpr });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:(%&\`%\`))`);
        });
    });

    describe("relationship", () => {
        test("Simple label expression: &", () => {
            const labelExpr = Cypher.labelExpr.and("A", "B");
            const relationship = new Cypher.Relationship();

            const pattern = new Cypher.Pattern(new Cypher.Node())
                .related(relationship, {
                    type: labelExpr,
                })
                .to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)-[this1:(A&B)]->(this2)`);
        });

        test("Simple label expression: |", () => {
            const labelExpr = Cypher.labelExpr.or("A", "B");
            const relationship = new Cypher.Relationship();

            const pattern = new Cypher.Pattern(new Cypher.Node())
                .related(relationship, {
                    type: labelExpr,
                })
                .to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)-[this1:(A|B)]->(this2)`);
        });

        test("Simple label expression: !", () => {
            const labelExpr = Cypher.labelExpr.not("A");
            const relationship = new Cypher.Relationship();

            const pattern = new Cypher.Pattern(new Cypher.Node())
                .related(relationship, {
                    type: labelExpr,
                })
                .to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)-[this1:!A]->(this2)`);
        });

        test("Label wildcard", () => {
            const labelExpr = Cypher.labelExpr.wildcard;
            const relationship = new Cypher.Relationship();

            const pattern = new Cypher.Pattern(new Cypher.Node())
                .related(relationship, {
                    type: labelExpr,
                })
                .to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)-[this1:%]->(this2)`);
        });

        test("Nested label expressions", () => {
            const labelExpr = Cypher.labelExpr.and(
                Cypher.labelExpr.and("A", "B"),
                Cypher.labelExpr.not(Cypher.labelExpr.or("B", Cypher.labelExpr.wildcard))
            );

            const relationship = new Cypher.Relationship();

            const pattern = new Cypher.Pattern(new Cypher.Node())
                .related(relationship, {
                    type: labelExpr,
                })
                .to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)-[this1:((A&B)&!(B|%))]->(this2)`);
        });

        test("Not Not expression", () => {
            const labelExpr = Cypher.labelExpr.not(Cypher.labelExpr.not("A"));

            const relationship = new Cypher.Relationship();

            const pattern = new Cypher.Pattern(new Cypher.Node())
                .related(relationship, {
                    type: labelExpr,
                })
                .to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)-[this1:!!A]->(this2)`);
        });

        test("Wildcard with escaped label", () => {
            const labelExpr = Cypher.labelExpr.and(Cypher.labelExpr.wildcard, "%");

            const relationship = new Cypher.Relationship();

            const pattern = new Cypher.Pattern(new Cypher.Node())
                .related(relationship, {
                    type: labelExpr,
                })
                .to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)-[this1:(%&\`%\`)]->(this2)`);
        });
    });
});
