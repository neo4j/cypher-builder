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

import Cypher from "../../src";

describe("escapeUnsafeLabels", () => {
    test("Match and update with escaping", () => {
        const personNode = new Cypher.Node();
        const movieNode = new Cypher.Node();

        const matchQuery = new Cypher.Match(
            new Cypher.Pattern(personNode, {
                labels: ["Person"],
                properties: {
                    ["person name"]: new Cypher.Literal(`Uneak "Seveer`),
                },
            })
                .related({ type: "ACTED IN" })
                .to(movieNode, { labels: ["A Movie"] })
        )
            .set([personNode.property("person name"), new Cypher.Param("Keanu Reeves")])
            .return([personNode, new Cypher.NamedVariable("My Result")]);

        const queryResult = matchQuery.build({
            unsafeEscapeOptions: {
                disableLabelEscaping: false,
                disableRelationshipTypeEscaping: false,
            },
        });
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Person { \`person name\`: \\"Uneak \\\\\\"Seveer\\" })-[:\`ACTED IN\`]->(this1:\`A Movie\`)
SET
    this0.\`person name\` = $param0
RETURN this0 AS \`My Result\`"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "Keanu Reeves",
}
`);
    });

    test("Match and update without escaping", () => {
        const personNode = new Cypher.Node();
        const movieNode = new Cypher.Node();

        const matchQuery = new Cypher.Match(
            new Cypher.Pattern(personNode, {
                labels: ["Person"],
                properties: {
                    ["person name"]: new Cypher.Literal(`Uneak "Seveer`),
                },
            })
                .related({ type: "ACTED IN" })
                .to(movieNode, { labels: ["A Movie"] })
        )
            .set([personNode.property("person name"), new Cypher.Param("Keanu Reeves")])
            .return([personNode, new Cypher.NamedVariable("My Result")]);

        const queryResult = matchQuery.build({
            unsafeEscapeOptions: {
                disableLabelEscaping: true,
                disableRelationshipTypeEscaping: true,
            },
        });
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Person { \`person name\`: \\"Uneak \\\\\\"Seveer\\" })-[:ACTED IN]->(this1:A Movie)
SET
    this0.\`person name\` = $param0
RETURN this0 AS \`My Result\`"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "Keanu Reeves",
}
`);
    });

    test("Match and update without escaping labels", () => {
        const personNode = new Cypher.Node();
        const movieNode = new Cypher.Node();

        const matchQuery = new Cypher.Match(
            new Cypher.Pattern(personNode, {
                labels: ["Person"],
                properties: {
                    ["person name"]: new Cypher.Literal(`Uneak "Seveer`),
                },
            })
                .related({ type: "ACTED IN" })
                .to(movieNode, { labels: ["A Movie"] })
        )
            .set([personNode.property("person name"), new Cypher.Param("Keanu Reeves")])
            .return([personNode, new Cypher.NamedVariable("My Result")]);

        const queryResult = matchQuery.build({
            unsafeEscapeOptions: {
                disableLabelEscaping: true,
            },
        });
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Person { \`person name\`: \\"Uneak \\\\\\"Seveer\\" })-[:\`ACTED IN\`]->(this1:A Movie)
SET
    this0.\`person name\` = $param0
RETURN this0 AS \`My Result\`"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "Keanu Reeves",
}
`);
    });
    test("Match and update without escaping types", () => {
        const personNode = new Cypher.Node();
        const movieNode = new Cypher.Node();

        const matchQuery = new Cypher.Match(
            new Cypher.Pattern(personNode, {
                labels: ["Person"],
                properties: {
                    ["person name"]: new Cypher.Literal(`Uneak "Seveer`),
                },
            })
                .related({ type: "ACTED IN" })
                .to(movieNode, { labels: ["A Movie"] })
        )
            .set([personNode.property("person name"), new Cypher.Param("Keanu Reeves")])
            .return([personNode, new Cypher.NamedVariable("My Result")]);

        const queryResult = matchQuery.build({
            unsafeEscapeOptions: {
                disableRelationshipTypeEscaping: true,
            },
        });
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Person { \`person name\`: \\"Uneak \\\\\\"Seveer\\" })-[:ACTED IN]->(this1:\`A Movie\`)
SET
    this0.\`person name\` = $param0
RETURN this0 AS \`My Result\`"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "Keanu Reeves",
}
`);
    });

    test("Simple example", () => {
        const personNode = new Cypher.Node();
        const movieNode = new Cypher.Node();

        const matchQuery = new Cypher.Match(
            new Cypher.Pattern(personNode, {
                labels: ["Person"],
                properties: {
                    ["person name"]: new Cypher.Literal(`Uneak "Seveer`),
                },
            })
                .related({ type: "ACTED IN" })
                .to(movieNode, { labels: ["A Movie"] })
        ).return(personNode);

        const queryResult = matchQuery.build({
            unsafeEscapeOptions: {
                disableLabelEscaping: true,
                disableRelationshipTypeEscaping: true,
            },
        });

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Person { \`person name\`: \\"Uneak \\\\\\"Seveer\\" })-[:ACTED IN]->(this1:A Movie)
RETURN this0"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Manually escaping with utils", () => {
        const personNode = new Cypher.Node();
        const movieNode = new Cypher.Node();

        const matchQuery = new Cypher.Match(
            new Cypher.Pattern(personNode, {
                labels: [Cypher.utils.escapeLabel("Person")],
                properties: {
                    ["person name"]: new Cypher.Literal(`Uneak "Seveer`),
                },
            })
                .related({ type: Cypher.utils.escapeType("ACTED IN") })
                .to(movieNode, { labels: [Cypher.utils.escapeLabel("A Movie")] })
        ).return(personNode);

        const queryResult = matchQuery.build({
            unsafeEscapeOptions: {
                disableLabelEscaping: true,
                disableRelationshipTypeEscaping: true,
            },
        });

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Person { \`person name\`: \\"Uneak \\\\\\"Seveer\\" })-[:\`ACTED IN\`]->(this1:\`A Movie\`)
RETURN this0"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
