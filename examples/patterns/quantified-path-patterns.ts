/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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

const { cypher, params } = query.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
