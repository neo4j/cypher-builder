/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// MATCH (this0:Person)
// RETURN CASE this0.eyes
//     WHEN "blue" THEN 1
//     WHEN "brown", "hazel" THEN 2
//     ELSE 3
// END AS eyeValue

const person = new Cypher.Node();
const caseClause = new Cypher.Case(person.property("eyes"))
    .when(new Cypher.Literal("blue"))
    .then(new Cypher.Literal(1))
    .when(new Cypher.Literal("brown"), new Cypher.Literal("hazel"))
    .then(new Cypher.Literal(2))
    .else(new Cypher.Literal(3));

const query = new Cypher.Match(new Cypher.Pattern(person, { labels: ["Person"] })).return([caseClause, "eyeValue"]);

const { cypher, params } = query.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
