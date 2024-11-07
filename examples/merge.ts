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

import Cypher from "..";

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
