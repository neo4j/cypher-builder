/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// MATCH (this0)
// WHERE (this0:Film OR this0:Film)
// RETURN this0

const movieNode = new Cypher.Node();

const matchQuery = new Cypher.Match(new Cypher.Pattern(movieNode))
    .where(Cypher.or(movieNode.hasLabel("Movie"), movieNode.hasLabel("Film")))
    .return(movieNode);

const { cypher, params } = matchQuery.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
