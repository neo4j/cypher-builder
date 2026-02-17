/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// MATCH (this0:Movie { title: $param0 })
//       ((:Movie)-[:ACTED_IN]->(:Person)){1,2}
//       (this1:Movie { title: $param1 })
// RETURN this1

const m = new Cypher.Node();
const m2 = new Cypher.Node();

const quantifiedPath = new Cypher.QuantifiedPath(
    new Cypher.Pattern(m, { labels: ["Movie"], properties: { title: new Cypher.Param("V for Vendetta") } }),
    new Cypher.Pattern({ labels: ["Movie"] })
        .related({ type: "ACTED_IN" })
        .to({ labels: ["Person"] })
        .quantifier({ min: 1, max: 2 }),
    new Cypher.Pattern(m2, {
        labels: ["Movie"],
        properties: { title: new Cypher.Param("Something's Gotta Give") },
    })
);

const query = new Cypher.Match(quantifiedPath).return(m2);

const { cypher, params } = query.build({
    labelOperator: "&",
});

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
