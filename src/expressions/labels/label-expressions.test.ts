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

import Cypher from "../..";
import { TestClause } from "../../utils/TestClause";

describe("Label Expressions", () => {
    describe("node", () => {
        test("Simple label expression: &", () => {
            const labelExpr = Cypher.labelExpr.and("A", "B");
            const node = new Cypher.Node({ labels: labelExpr });

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:(A&B))`);
        });

        test("Simple label expression: |", () => {
            const labelExpr = Cypher.labelExpr.or("A", "B");
            const node = new Cypher.Node({ labels: labelExpr });

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:(A|B))`);
        });

        test("Multiple labels with expression: &", () => {
            const labelExpr = Cypher.labelExpr.and(...["A", "B", "C"]);
            const node = new Cypher.Node({ labels: labelExpr });

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:(A&B&C))`);
        });

        test("Multiple labels with expression: |", () => {
            const labelExpr = Cypher.labelExpr.or(...["A", "B", "C"]);
            const node = new Cypher.Node({ labels: labelExpr });

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:(A|B|C))`);
        });

        test("No labels with expression: &", () => {
            const labelExpr = Cypher.labelExpr.and();
            const node = new Cypher.Node({ labels: labelExpr });

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)`);
        });

        test("No labels with expression: |", () => {
            const labelExpr = Cypher.labelExpr.or();
            const node = new Cypher.Node({ labels: labelExpr });

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)`);
        });

        test("Simple label expression: !", () => {
            const labelExpr = Cypher.labelExpr.not("A");
            const node = new Cypher.Node({ labels: labelExpr });

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:!A)`);
        });

        test("Label wildcard", () => {
            const labelExpr = Cypher.labelExpr.wildcard;
            const node = new Cypher.Node({ labels: labelExpr });

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:%)`);
        });

        test("Nested label expressions", () => {
            const labelExpr = Cypher.labelExpr.and(
                Cypher.labelExpr.and("A", "B"),
                Cypher.labelExpr.not(Cypher.labelExpr.or("B", Cypher.labelExpr.wildcard))
            );

            const node = new Cypher.Node({ labels: labelExpr });

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:((A&B)&!(B|%)))`);
        });

        test("Not Not expression", () => {
            const labelExpr = Cypher.labelExpr.not(Cypher.labelExpr.not("A"));

            const node = new Cypher.Node({ labels: labelExpr });

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:!!A)`);
        });

        test("Wildcard with escaped label", () => {
            const labelExpr = Cypher.labelExpr.and(Cypher.labelExpr.wildcard, "%");

            const node = new Cypher.Node({ labels: labelExpr });

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0:(%&\`%\`))`);
        });
    });

    describe("relationship", () => {
        test("Simple label expression: &", () => {
            const labelExpr = Cypher.labelExpr.and("A", "B");
            const relationship = new Cypher.Relationship({
                type: labelExpr,
            });

            const pattern = new Cypher.Pattern(new Cypher.Node()).related(relationship).to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)-[this1:(A&B)]->(this2)`);
        });

        test("Simple label expression: |", () => {
            const labelExpr = Cypher.labelExpr.or("A", "B");
            const relationship = new Cypher.Relationship({
                type: labelExpr,
            });

            const pattern = new Cypher.Pattern(new Cypher.Node()).related(relationship).to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)-[this1:(A|B)]->(this2)`);
        });

        test("Simple label expression: !", () => {
            const labelExpr = Cypher.labelExpr.not("A");
            const relationship = new Cypher.Relationship({
                type: labelExpr,
            });

            const pattern = new Cypher.Pattern(new Cypher.Node()).related(relationship).to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)-[this1:!A]->(this2)`);
        });

        test("Label wildcard", () => {
            const labelExpr = Cypher.labelExpr.wildcard;
            const relationship = new Cypher.Relationship({
                type: labelExpr,
            });

            const pattern = new Cypher.Pattern(new Cypher.Node()).related(relationship).to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)-[this1:%]->(this2)`);
        });

        test("Nested label expressions", () => {
            const labelExpr = Cypher.labelExpr.and(
                Cypher.labelExpr.and("A", "B"),
                Cypher.labelExpr.not(Cypher.labelExpr.or("B", Cypher.labelExpr.wildcard))
            );

            const relationship = new Cypher.Relationship({
                type: labelExpr,
            });

            const pattern = new Cypher.Pattern(new Cypher.Node()).related(relationship).to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)-[this1:((A&B)&!(B|%))]->(this2)`);
        });

        test("Not Not expression", () => {
            const labelExpr = Cypher.labelExpr.not(Cypher.labelExpr.not("A"));

            const relationship = new Cypher.Relationship({
                type: labelExpr,
            });

            const pattern = new Cypher.Pattern(new Cypher.Node()).related(relationship).to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)-[this1:!!A]->(this2)`);
        });

        test("Wildcard with escaped label", () => {
            const labelExpr = Cypher.labelExpr.and(Cypher.labelExpr.wildcard, "%");

            const relationship = new Cypher.Relationship({
                type: labelExpr,
            });

            const pattern = new Cypher.Pattern(new Cypher.Node()).related(relationship).to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toBe(`(this0)-[this1:(%&\`%\`)]->(this2)`);
        });
    });
});
