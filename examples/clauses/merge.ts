/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// MERGE (this0:MyLabel)
// ON MATCH SET
//     this0.count = (this0.count + 1)
// ON CREATE SET
//     this0.count = 1

const node = new Cypher.Node();

const countProp = node.property("count");
const query = new Cypher.Merge(
    new Cypher.Pattern(node, {
        labels: ["MyLabel"],
    })
)
    .onCreateSet([countProp, new Cypher.Literal(1)])
    .onMatchSet([countProp, Cypher.plus(countProp, new Cypher.Literal(1))]);

const { cypher, params } = query.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
