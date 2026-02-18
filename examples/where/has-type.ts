/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// MATCH (:Movie)-[this0]->(this1:Person)
// WHERE (this0:ACTED_IN OR this0:DIRECTED)
// RETURN this1

const personNode = new Cypher.Node();
const actedIn = new Cypher.Relationship();

const actedInPattern = new Cypher.Pattern({ labels: ["Movie"] })
    .related(actedIn)
    .to(personNode, { labels: ["Person"] });

const matchQuery = new Cypher.Match(actedInPattern)
    .where(Cypher.or(actedIn.hasType("ACTED_IN"), actedIn.hasType("DIRECTED")))
    .return(personNode);

const { cypher, params } = matchQuery.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
