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
        expect(queryResult.cypher).toEndWith(`(this0:((A&B)&!(B|%)))`);
    });

    test("Wildcard with escaped label", () => {
        const labelExpr = Cypher.labelExpr.and(Cypher.labelExpr.wildcard, "%");

        const node = new Cypher.Node({ labels: labelExpr });

        const pattern = new Cypher.Pattern(node);
        const queryResult = new TestClause(pattern).build();
        expect(queryResult.cypher).toEndWith(`(this0:(%&\`%\`))`);
    });
});
