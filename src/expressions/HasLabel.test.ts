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

import Cypher from "..";
import { HasLabel } from "../../HasLabel";
import { TestClause } from "../utils/TestClause";

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
"MATCH (this0:Movie)-[this1]->(this2)
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
"MATCH (this0:Movie)-[this1:ACTED_IN]->(this2)
WHERE this1:(ACTED_IN|STARRED_IN)"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });
});
