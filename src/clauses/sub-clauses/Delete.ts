/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherASTNode } from "../../CypherASTNode.js";
import type { CypherEnvironment } from "../../Environment.js";
import type { NodeRef } from "../../references/NodeRef.js";
import type { RelationshipRef } from "../../references/RelationshipRef.js";
import type { Variable } from "../../references/Variable.js";

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
