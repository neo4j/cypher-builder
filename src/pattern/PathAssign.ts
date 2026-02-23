/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { PathVariable, Pattern, QuantifiedPath } from "../index.js";
import { CypherASTNode } from "../CypherASTNode.js";
import type { CypherEnvironment } from "../Environment.js";

/**
 * @group Patterns
 */
export class PathAssign<T extends Pattern | QuantifiedPath> extends CypherASTNode {
    private readonly variable: PathVariable;
    private readonly pattern: T;

    constructor(pattern: T, variable: PathVariable) {
        super();
        this.addChildren(pattern);
        this.pattern = pattern;
        this.variable = variable;
    }

    public getCypher(env: CypherEnvironment): string {
        const patternStr = this.pattern.getCypher(env);
        const variableStr = this.variable.getCypher(env);

        return `${variableStr} = ${patternStr}`;
    }
}
