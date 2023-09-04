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

// MATCH (this0:`Movie`)
// WHERE this0.prop = $myParam
// RETURN this0

const movie = new Cypher.Node({ labels: ["Movie"] });
const match = new Cypher.Match(movie)
    .where(
        new Cypher.RawCypher((env) => {
            const movieStr = env.compile(movie);

            const cypher = `${movieStr}.prop = $myParam`;
            const params = {
                myParam: "Hello World",
            };

            return [cypher, params];
        })
    )
    .return(movie);

const { cypher, params } = match.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
