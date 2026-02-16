/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// MATCH (this1:`Person`)-[this0:ACTED_IN]->(this2:`Movie`)
// WHERE (this1.name = $param0 AND this2.released = $param1)
// RETURN this2.title, this2.released AS year

const movieNode = new Cypher.Node();
const personNode = new Cypher.Node();

const actedInPattern = new Cypher.Pattern(movieNode, { labels: ["Movie"] })
    .related({ type: "ACTED_IN" })
    .to(personNode, { labels: ["Person"] });

const matchQuery = new Cypher.Match(actedInPattern)
    .where(personNode, { name: new Cypher.Param("Keanu Reeves") })
    .and(movieNode, { released: new Cypher.Param(1999) })
    .return(movieNode.property("title"), [movieNode.property("released"), "year"]);

const { cypher, params } = matchQuery.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
