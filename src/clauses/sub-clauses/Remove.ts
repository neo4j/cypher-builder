/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { Label } from "../../references/Label";
import type { PropertyRef } from "../../references/PropertyRef";

export class RemoveClause extends CypherASTNode {
    private readonly removeInput: Array<PropertyRef | Label>;

    constructor(parent: CypherASTNode | undefined, removeInput: Array<PropertyRef | Label>) {
        super(parent);
        this.removeInput = removeInput;
    }

    public addParams(...params: Array<PropertyRef | Label>): void {
        this.removeInput.push(...params);
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const propertiesToDelete = this.removeInput.map((e) => e.getCypher(env));
        return `REMOVE ${propertiesToDelete.join(", ")}`;
    }
}
