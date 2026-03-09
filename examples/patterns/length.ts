/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// MATCH (this0)-[this1:ACTED_IN*2..10]->()
// RETURN this0

const movie = new Cypher.Node();
const actedIn = new Cypher.Relationship();

const pattern = new Cypher.Pattern(movie).related(actedIn, { type: "ACTED_IN", length: { min: 2, max: 10 } }).to();

const matchQuery = new Cypher.Match(pattern).return(movie);

const { cypher, params } = matchQuery.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
