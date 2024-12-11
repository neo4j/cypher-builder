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

import Cypher from "../..";

// RETURN trim(" Simple Trim "), trim(BOTH "x" FROM "xxxhelloxxx")

// Using `trim()` with the simple syntax and the advanced trim expression
const query = new Cypher.Return(
    Cypher.trim(new Cypher.Literal(" Simple Trim ")),
    Cypher.trim("BOTH", new Cypher.Literal("x"), new Cypher.Literal("xxxhelloxxx"))
);

const { cypher, params } = query.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
