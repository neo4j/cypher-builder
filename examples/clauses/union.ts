/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// MATCH (this0:Actor)
// RETURN this0.name AS name
// UNION DISTINCT
// MATCH (this0:Movie)
// RETURN this0.title AS name

const n = new Cypher.Node();

const match1 = new Cypher.Match(new Cypher.Pattern(n, { labels: ["Actor"] })).return([n.property("name"), "name"]);
const match2 = new Cypher.Match(new Cypher.Pattern(n, { labels: ["Movie"] })).return([n.property("title"), "name"]);

const union = new Cypher.Union(match1, match2).distinct();

const { cypher, params } = union.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
