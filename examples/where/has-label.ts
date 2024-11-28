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

// MATCH (this0)
// WHERE (this0:Film OR this0:Film)
// RETURN this0

const movieNode = new Cypher.Node();

const matchQuery = new Cypher.Match(new Cypher.Pattern(movieNode))
    .where(Cypher.or(movieNode.hasLabel("Movie"), movieNode.hasLabel("Film")))
    .return(movieNode);

const { cypher, params } = matchQuery.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
