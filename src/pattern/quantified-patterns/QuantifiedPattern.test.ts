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

describe("QuantifiedPattern", () => {
    test.each(["*", "+"] as const)("Quantified pattern with %s in quantifier", (quantifier) => {
        const quantifiedPattern = new Cypher.Pattern({ labels: ["Movie"] })
            .related({ type: "ACTED_IN" })
            .to({ labels: ["Person"] })
            .quantifier(quantifier);

        const queryResult = new TestClause(quantifiedPattern).build();
        expect(queryResult.cypher).toEqual(`((:Movie)-[:ACTED_IN]->(:Person))${quantifier}`);
    });

    test("Quantified pattern with min and max", () => {
        const quantifiedPattern = new Cypher.Pattern({ labels: ["Movie"] })
            .related({ type: "ACTED_IN" })
            .to({ labels: ["Person"] })
            .quantifier({
                min: 1,
                max: 3,
            });

        const queryResult = new TestClause(quantifiedPattern).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"((:Movie)-[:ACTED_IN]->(:Person)){1,3}"`);
    });

    test("Quantified pattern with undefined max", () => {
        const quantifiedPattern = new Cypher.Pattern({ labels: ["Movie"] })
            .related({ type: "ACTED_IN" })
            .to({ labels: ["Person"] })
            .quantifier({
                min: 1,
            });

        const queryResult = new TestClause(quantifiedPattern).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"((:Movie)-[:ACTED_IN]->(:Person)){1,}"`);
    });

    test("Quantified pattern with undefined min", () => {
        const quantifiedPattern = new Cypher.Pattern({ labels: ["Movie"] })
            .related({ type: "ACTED_IN" })
            .to({ labels: ["Person"] })
            .quantifier({
                max: 2,
            });

        const queryResult = new TestClause(quantifiedPattern).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"((:Movie)-[:ACTED_IN]->(:Person)){,2}"`);
    });

    test("Quantified pattern with undefined min and max", () => {
        const quantifiedPattern = new Cypher.Pattern({ labels: ["Movie"] })
            .related({ type: "ACTED_IN" })
            .to({ labels: ["Person"] })
            .quantifier({});

        const queryResult = new TestClause(quantifiedPattern).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"((:Movie)-[:ACTED_IN]->(:Person)){,}"`);
    });

    test("Quantified pattern with number", () => {
        const quantifiedPattern = new Cypher.Pattern({ labels: ["Movie"] })
            .related({ type: "ACTED_IN" })
            .to({ labels: ["Person"] })
            .quantifier(5);

        const queryResult = new TestClause(quantifiedPattern).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"((:Movie)-[:ACTED_IN]->(:Person)){5}"`);
    });
});
