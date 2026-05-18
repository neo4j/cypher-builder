/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// MATCH (this0:Customer)
// RETURN this0 AS var1
// NEXT
// MATCH (this2:Product)
// RETURN this2

const customer = new Cypher.Variable();
const customerNode = new Cypher.Node();
const productNode = new Cypher.Node();

const query = new Cypher.Match(new Cypher.Pattern(customerNode, { labels: ["Customer"] }))
    .return([customerNode, customer])
    .next()
    .match(new Cypher.Pattern(productNode, { labels: ["Product"] }))
    .return(productNode);

const { cypher, params } = query.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
