/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { LabelExpr } from "../index.js";
import { CypherASTNode } from "../CypherASTNode.js";
import type { CypherEnvironment } from "../Environment.js";
import type { NodeRef } from "../references/NodeRef.js";
import type { RelationshipRef } from "../references/RelationshipRef.js";
import { addLabelToken } from "../utils/add-label-token.js";
import { escapeLabel } from "../utils/escape.js";

/** Generates a predicate to check if a node has a label or a relationship has a type
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/where/#filter-on-node-label | Cypher Documentation}
 * @group Expressions
 * @example
 * ```cypher
 * MATCH(this)
 * WHERE this:MyNode
 * ```
 */
export class HasLabel extends CypherASTNode {
    private readonly node: NodeRef | RelationshipRef;
    private readonly expectedLabels: string[] | LabelExpr;

    /**
     * @internal
     */
    constructor(node: NodeRef | RelationshipRef, expectedLabels: string[] | LabelExpr) {
        super();
        this.validateLabelsInput(expectedLabels);
        this.node = node;
        this.expectedLabels = expectedLabels;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const nodeId = this.node.getCypher(env);
        const labelsStr = this.generateLabelExpressionStr(env);
        return `${nodeId}${labelsStr}`;
    }

    private generateLabelExpressionStr(env: CypherEnvironment): string {
        if (Array.isArray(this.expectedLabels)) {
            const escapedLabels = this.expectedLabels.map((label) => escapeLabel(label));
            return addLabelToken(...escapedLabels);
        } else {
            return addLabelToken(this.expectedLabels.getCypher(env));
        }
    }

    private validateLabelsInput(expectedLabels: string[] | LabelExpr): void {
        if (Array.isArray(expectedLabels) && expectedLabels.length === 0) {
            throw new Error("HasLabel needs at least 1 label");
        }
    }
}
