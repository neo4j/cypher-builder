/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import * as Cypher from "../../src";

describe("https://github.com/neo4j/cypher-builder/issues/462", () => {
    test("SET and REMOVE statatements order should be preserved", () => {
        const nameParam = new Cypher.Param("Keanu Reeves");
        const evilKeanu = new Cypher.Param("Seveer unaeK");

        const personNode = new Cypher.Node();

        const matchQuery = new Cypher.Match(new Cypher.Pattern(personNode, { labels: ["Person"] }))
            .where(personNode, { name: nameParam })
            .set([personNode.property("name"), evilKeanu])
            .remove(personNode.property("anotherName"))
            .set([personNode.property("anotherName"), new Cypher.Param(nameParam)])
            .set([personNode.property("oldName"), new Cypher.Param(nameParam)])
            .return(personNode);

        const queryResult = matchQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Person)
WHERE this0.name = $param0
SET this0.name = $param1
REMOVE this0.anotherName
SET
  this0.anotherName = $param2,
  this0.oldName = $param3
RETURN this0"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "Keanu Reeves",
  "param1": "Seveer unaeK",
  "param2": Param {
    "prefix": "param",
    "value": "Keanu Reeves",
  },
  "param3": Param {
    "prefix": "param",
    "value": "Keanu Reeves",
  },
}
`);
    });

    test("Merge multiple remove together", () => {
        const nameParam = new Cypher.Param("Keanu Reeves");

        const personNode = new Cypher.Node();

        const matchQuery = new Cypher.Match(new Cypher.Pattern(personNode, { labels: ["Person"] }))
            .where(personNode, { name: nameParam })
            .remove(personNode.property("name"))
            .remove(personNode.property("anotherName"))
            .return(personNode);

        const queryResult = matchQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Person)
WHERE this0.name = $param0
REMOVE this0.name, this0.anotherName
RETURN this0"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "Keanu Reeves",
}
`);
    });
});
