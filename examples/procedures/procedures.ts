/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// CALL db.labels() yield label as this0
// RETURN this0

const label = new Cypher.NamedVariable("label");

const labelVar = new Cypher.Variable();
const labelsCall = Cypher.db.labels().yield(["label", labelVar]).return(label);

const { cypher, params } = labelsCall.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
