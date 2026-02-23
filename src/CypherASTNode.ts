/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "./Environment.js";
import type { CypherCompilable } from "./types.js";

/** Abstract class representing a Cypher Statement in the AST
 * @internal
 */
export abstract class CypherASTNode implements CypherCompilable {
    protected parent?: CypherASTNode;

    /** @internal */
    constructor(parent?: CypherASTNode) {
        this.parent = parent;
    }

    /** @internal */
    public getRoot(): CypherASTNode {
        if (this.parent) {
            return this.parent.getRoot();
        }
        return this;
    }

    /** Concrete tree traversal pattern to generate the Cypher on nested nodes
     * @internal
     */
    public abstract getCypher(env: CypherEnvironment): string;

    /** Sets the parent-child relationship for build traversal */
    protected addChildren(...nodes: CypherCompilable[]): void {
        for (const node of nodes) {
            if (node instanceof CypherASTNode) {
                node.setParent(this);
            }
        }
    }

    protected setParent(node: CypherASTNode): void {
        this.parent = node;
    }

    protected get isRoot(): boolean {
        return this.parent === undefined;
    }
}
