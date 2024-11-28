/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { LabelExpr } from "..";
import { CypherASTNode } from "../CypherASTNode";
import type { CypherEnvironment } from "../Environment";
import type { NodeRef } from "../references/NodeRef";
import type { RelationshipRef } from "../references/RelationshipRef";
import { addLabelToken } from "../utils/add-label-token";
import { escapeLabel } from "../utils/escape";

/** Generates a predicate to check if a node has a label or a relationship has a type
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/where/#filter-on-node-label | Cypher Documentation}
 * @group Other
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
     * @hidden
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
            return addLabelToken(env.config.labelOperator, ...escapedLabels);
        } else {
            return addLabelToken(env.config.labelOperator, this.expectedLabels.getCypher(env));
        }
    }

    private validateLabelsInput(expectedLabels: string[] | LabelExpr): void {
        if (Array.isArray(expectedLabels) && expectedLabels.length === 0) {
            throw new Error("HasLabel needs at least 1 label");
        }
    }
}
