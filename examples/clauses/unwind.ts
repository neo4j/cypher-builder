/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// UNWIND $param0 AS var0
// WITH DISTINCT var0
// RETURN collect(var0) AS setOfVals

const coll = new Cypher.Variable();

const unwind = new Cypher.Unwind([new Cypher.Param([1, 2, 3, 4]), coll])
    .with(coll)
    .distinct()
    .return([Cypher.collect(coll), "setOfVals"]);

const { cypher, params } = unwind.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
