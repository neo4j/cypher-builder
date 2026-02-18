/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// CALL myProc(var0) YIELD column AS var1
// RETURN var1

const responseVar = new Cypher.Variable();
const customProcedure = new Cypher.Procedure("myProc", [new Cypher.Variable()]).yield(["column", responseVar]);

const clause = customProcedure.return(responseVar);

const { cypher, params } = clause.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
