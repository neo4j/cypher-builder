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
import type { Param } from "../../references/Param";
import type { PropertyRef } from "../../references/PropertyRef";
import type { Variable } from "../../references/Variable";
import type { Call } from "../Call";

export type SetParam = [PropertyRef, Param<unknown>];

/** Represents a WITH statement to import variables into a CALL subquery */
export class ImportWith extends CypherASTNode {
    private params: Variable[];
    private hasStar = false;

    constructor(parent: Call, params: Array<"*" | Variable>) {
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
