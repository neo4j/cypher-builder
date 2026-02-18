/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Expr } from "..";
import { CypherASTNode } from "../CypherASTNode";
import type { CypherEnvironment } from "../Environment";
import type { NodeRef } from "../references/NodeRef";
import { addLabelToken } from "../utils/add-label-token";
import { escapeLabel } from "../utils/escape";

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
