/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
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
