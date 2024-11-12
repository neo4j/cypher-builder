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

// UNWIND $param0 AS var0
// WITH DISTINCT var0
// RETURN collect(var0) AS setOfVals

const coll = new Cypher.Variable();

const unwind = new Cypher.Unwind([new Cypher.Param([1, 2, 3, 4]), coll])
    .with(coll)
    .distinct()
    .return([Cypher.collect(coll), "setOfVals"]);

const { cypher, params } = unwind.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
