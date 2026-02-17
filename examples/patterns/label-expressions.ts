/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../dist";

// MATCH (this0:((Movie|Film)&!Show))
// RETURN this0

const movieNode = new Cypher.Node();

const matchQuery = new Cypher.Match(
    new Cypher.Pattern(movieNode, {
        labels: Cypher.labelExpr.and(Cypher.labelExpr.or("Movie", "Film"), Cypher.labelExpr.not("Show")),
    })
).return(movieNode);

const { cypher, params } = matchQuery.build({
    labelOperator: "&",
});

console.log("Cypher");
console.log(cypher);
console.log("----");
console.log("Params", params);
