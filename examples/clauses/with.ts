/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// WITH *, this0 AS result

const movieNode = new Cypher.Node();

const withStatement = new Cypher.With("*", [movieNode, "result"]);

const { cypher, params } = withStatement.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
