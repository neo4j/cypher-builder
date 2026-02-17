/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import console from "console";
import Cypher from "../../dist";

// FOREACH (var0 IN $param0 |
//     CREATE (:Movie { id: var0 })
// )

const x = new Cypher.Variable();
const query = new Cypher.Foreach(x).in(new Cypher.Param([1, 2, 3])).do(
    new Cypher.Create(
        new Cypher.Pattern({
            labels: ["Movie"],
            properties: {
                id: x,
            },
        })
    )
);

const { cypher, params } = query.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
