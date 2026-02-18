/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// MATCH (this0:`Movie`)
// WHERE this0.prop = $myParam
// RETURN this0

const movie = new Cypher.Node();
const match = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["Movie"] }))
    .where(
        new Cypher.Raw((env) => {
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
