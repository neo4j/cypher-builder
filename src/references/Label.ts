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
        const labelsStr = this.generateLabelExpressionStr(env);
        return `${nodeId}${labelsStr}`;
    }

    private generateLabelExpressionStr(env: CypherEnvironment): string {
        return addLabelToken(env.config.labelOperator, escapeLabel(this.label));
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
        const labelStr = addLabelToken(env.config.labelOperator, exprStr);
        return `${nodeId}${labelStr}`;
    }
}
