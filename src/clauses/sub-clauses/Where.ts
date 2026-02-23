/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherASTNode } from "../../CypherASTNode.js";
import type { CypherEnvironment } from "../../Environment.js";
import { and } from "../../expressions/operations/boolean.js";
import type { Predicate } from "../../types.js";

export class Where extends CypherASTNode {
    private wherePredicate: Predicate;

    constructor(parent: CypherASTNode | undefined, whereInput: Predicate) {
        super(parent);
        this.wherePredicate = whereInput;
        this.addChildren(this.wherePredicate);
    }

    public and(op: Predicate): void {
        this.wherePredicate = and(this.wherePredicate, op);
        this.addChildren(this.wherePredicate);
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const opStr = this.wherePredicate.getCypher(env);
        if (!opStr) return "";
        return `WHERE ${opStr}`;
    }
}
