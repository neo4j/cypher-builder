/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Expr } from "../index.js";
import { CypherASTNode } from "../CypherASTNode.js";
import type { CypherEnvironment } from "../Environment.js";
import type { NodeRef } from "../references/NodeRef.js";
import { addLabelToken } from "../utils/add-label-token.js";
import { escapeLabel } from "../utils/escape.js";

/** Represents a label attached to a {@link NodeRef | Node}
 * @group Variables
 * @example
 *
 * ```js
 * movies.label("Movie")
 * ```
 *
 * _Cypher:_
 * ```cypher
 * this0:Movie
 * ```
 */
export class Label extends CypherASTNode {
    protected readonly node: NodeRef;
    private readonly label: string;

    /**
     * @internal
     */
    constructor(node: NodeRef, label: string) {
        super();
        this.node = node;
        this.label = label;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const nodeId = this.node.getCypher(env);
        const labelsStr = this.generateLabelExpressionStr();
        return `${nodeId}${labelsStr}`;
    }

    private generateLabelExpressionStr(): string {
        return addLabelToken(escapeLabel(this.label));
    }
}

export class DynamicLabel extends Label {
    private readonly expr: Expr;

    /**
     * @internal
     */
    constructor(node: NodeRef, expr: Expr) {
        super(node, "");
        this.expr = expr;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const nodeId = this.node.getCypher(env);
        const exprStr = `$(${this.expr.getCypher(env)})`;
        const labelStr = addLabelToken(exprStr);
        return `${nodeId}${labelStr}`;
    }
}
