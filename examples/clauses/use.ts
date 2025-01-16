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

// USE mydb
// MATCH (this0:Movie)
// RETURN this0

const n = new Cypher.Node();
const query = new Cypher.Match(new Cypher.Pattern(n, { labels: ["Movie"] })).return(n);

const useQuery = new Cypher.Use("mydb", query);
const { cypher, params } = useQuery.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
