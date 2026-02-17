/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// USE mydb
// MATCH (this0:Movie)
// RETURN this0

const n = new Cypher.Node();
const query = new Cypher.Match(new Cypher.Pattern(n, { labels: ["Movie"] })).return(n);

const useQuery = new Cypher.Use("mydb", query);
const { cypher, params } = useQuery.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
