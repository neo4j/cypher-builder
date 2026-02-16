/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// RETURN 10 as myVal

const customReturn = new Cypher.Raw(`10 as myVal`);

const returnClause = new Cypher.Return(customReturn);

const { cypher, params } = returnClause.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
