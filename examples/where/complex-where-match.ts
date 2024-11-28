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

// MATCH (var0:Movie)-[:ACTED_IN]->(var1:Person)
// WHERE (var1.name = $param0 AND (var0.year = $param1 OR var0.year = $param2))
// RETURN var0.title

const movieNode = new Cypher.Variable();
const personNode = new Cypher.Variable();

const actedInRelationship = new Cypher.Pattern(movieNode, { labels: ["Movie"] })
    .related({ type: "ACTED_IN" })
    .to(personNode, { labels: ["Person"] });

const matchQuery = new Cypher.Match(actedInRelationship)
    .where(
        Cypher.and(
            Cypher.eq(personNode.property("name"), new Cypher.Param("Keanu Reeves")),
            Cypher.or(
                Cypher.eq(movieNode.property("year"), new Cypher.Param(1999)),
                Cypher.eq(movieNode.property("year"), new Cypher.Param(2000))
            )
        )
    )
    .return(movieNode.property("title"));

const { cypher, params } = matchQuery.build();

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
