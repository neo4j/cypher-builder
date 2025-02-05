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

import type { Variable } from "../..";
import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { MapExpr } from "../../expressions/map/MapExpr";
import type { MapProjection } from "../../expressions/map/MapProjection";
import { Label } from "../../references/Label";
import type { PropertyRef } from "../../references/PropertyRef";
import type { Expr } from "../../types";
import { padBlock } from "../../utils/pad-block";

export type SetParam = [PropertyRef, Exclude<Expr, MapExpr | MapProjection>] | [Variable, MapExpr | Variable] | Label;

export class SetClause extends CypherASTNode {
    protected params: SetParam[];

    constructor(parent: CypherASTNode, params: SetParam[] = []) {
        super(parent);
        this.params = params;
    }

    public addParams(...params: SetParam[]): void {
        this.params.push(...params);
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        if (this.params.length === 0) return "";
        const paramsStr = this.params
            .map((param) => {
                return this.composeParam(env, param);
            })
            .join(",\n");

        return `SET\n${padBlock(paramsStr)}`;
    }

    private composeParam(env: CypherEnvironment, setParam: SetParam): string {
        if (setParam instanceof Label) {
            return setParam.getCypher(env);
        } else {
            const [ref, param] = setParam;
            return `${ref.getCypher(env)} = ${param.getCypher(env)}`;
        }
    }
}
