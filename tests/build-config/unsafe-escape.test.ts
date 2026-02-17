/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
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
                disableNodeLabelEscaping: false,
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
                disableNodeLabelEscaping: true,
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
                disableNodeLabelEscaping: true,
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
                disableNodeLabelEscaping: true,
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
                disableNodeLabelEscaping: true,
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
