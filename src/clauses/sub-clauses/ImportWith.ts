/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { Variable } from "../../references/Variable";

/** Represents a WITH statement to import variables into a CALL subquery */
export class ImportWith extends CypherASTNode {
    private readonly params: Variable[];
    private hasStar = false;

    constructor(parent: CypherASTNode, params: Array<"*" | Variable>) {
        super(parent);
        this.params = this.filterParams(params);
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        let paramsStr = this.params.map((v) => v.getCypher(env));
        if (this.hasStar) {
            paramsStr = ["*", ...paramsStr];
        }

        return `WITH ${paramsStr.join(", ")}`;
    }

    private filterParams(params: Array<"*" | Variable>): Variable[] {
        return params.filter((p: "*" | Variable): p is Variable => {
            if (p === "*") {
                this.hasStar = true;
                return false;
            }
            return true;
        });
    }
}
