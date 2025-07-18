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

import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { NodeRef } from "../../references/NodeRef";
import type { RelationshipRef } from "../../references/RelationshipRef";
import type { Variable } from "../../references/Variable";

/** @group Clauses */
export type DeleteInput = Array<NodeRef | RelationshipRef | Variable>;

type DetachKeyword = "DETACH" | "NODETACH";

export class DeleteClause extends CypherASTNode {
    private readonly deleteInput: DeleteInput;
    private detachKeyword: DetachKeyword | undefined;

    constructor(parent: CypherASTNode, deleteInput: DeleteInput) {
        super(parent);
        this.deleteInput = deleteInput;
    }

    public detach(): void {
        this.detachKeyword = "DETACH";
    }

    public noDetach(): void {
        this.detachKeyword = "NODETACH";
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const itemsToDelete = this.deleteInput.map((e) => e.getCypher(env));
        const detachStr = this.detachKeyword ? `${this.detachKeyword} ` : "";
        return `${detachStr}DELETE ${itemsToDelete.join(",")}`;
    }
}
