/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Pattern } from "../../index.js";
import { CypherASTNode } from "../../CypherASTNode.js";
import { Clause } from "../../clauses/Clause.js";
import type { CypherCompilable } from "../../types.js";

export abstract class Subquery extends CypherASTNode {
    protected subquery: CypherCompilable;

    constructor(subquery: Clause | Pattern) {
        super();
        let rootQuery: CypherCompilable;
        if (subquery instanceof Clause) {
            rootQuery = subquery.getRoot();
        } else {
            rootQuery = subquery;
        }
        this.addChildren(rootQuery);
        this.subquery = rootQuery;
    }
}
