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

// MATCH (this0:Actor)
// RETURN this0.name AS name
// UNION DISTINCT
// MATCH (this0:Movie)
// RETURN this0.title AS name

const n = new Cypher.Node();

const match1 = new Cypher.Match(new Cypher.Pattern(n, { labels: ["Actor"] })).return([n.property("name"), "name"]);
const match2 = new Cypher.Match(new Cypher.Pattern(n, { labels: ["Movie"] })).return([n.property("title"), "name"]);

const union = new Cypher.Union(match1, match2).distinct();

const { cypher, params } = union.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
