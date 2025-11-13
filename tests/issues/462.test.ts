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
