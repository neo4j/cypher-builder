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

// CREATE (this0:Movie)
// SET
//     this0.title = $param0,
//     this0.year = $param1
// CREATE (this1:Movie)
// SET
//     this1.title = $param0
// CREATE (this2:Movie)
// SET
//     this2 = { title: $param0, year: $param2 }

const titleParam = new Cypher.Param("The Matrix");

const movie1 = new Cypher.Node();
const movie2 = new Cypher.Node();
const movie3 = new Cypher.Node();

// Note that both nodes share the same param
const create1 = new Cypher.Create(new Cypher.Pattern(movie1, { labels: ["Movie"] })).set(
    [movie1.property("title"), titleParam],
    [movie1.property("year"), new Cypher.Param(1999)]
);
const create2 = new Cypher.Create(new Cypher.Pattern(movie2, { labels: ["Movie"] })).set([
    movie2.property("title"),
    titleParam,
]);

const create3 = new Cypher.Create(new Cypher.Pattern(movie3, { labels: ["Movie"] })).set([
    movie3,
    new Cypher.Map({
        title: titleParam,
        year: new Cypher.Param(1999),
    }),
]);

const { cypher, params } = Cypher.utils.concat(create1, create2, create3).build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
