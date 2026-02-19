/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherASTNode } from "../../CypherASTNode.js";
import type { CypherEnvironment } from "../../Environment.js";
import type { MapExpr } from "../../expressions/map/MapExpr.js";
import type { MapProjection } from "../../expressions/map/MapProjection.js";
import { Label } from "../../references/Label.js";
import type { PropertyRef } from "../../references/PropertyRef.js";
import type { Variable } from "../../references/Variable.js";
import type { Expr } from "../../types.js";
import { padBlock } from "../../utils/pad-block.js";

/** @group Clauses */
export type SetParam =
    | [PropertyRef, Exclude<Expr, MapExpr | MapProjection>]
    | [Variable, MapExpr | Variable | PropertyRef]
    | [Variable, "+=", MapExpr | Variable | PropertyRef]
    | Label;

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

        if (this.params.length == 1) {
            return `SET ${paramsStr}`;
        } else {
            return `SET\n${padBlock(paramsStr)}`;
        }
    }

    private composeParam(env: CypherEnvironment, setParam: SetParam): string {
        if (setParam instanceof Label) {
            return setParam.getCypher(env);
        } else if (setParam.length === 3) {
            const [ref, operator, param] = setParam;
            return `${ref.getCypher(env)} ${operator} ${param.getCypher(env)}`;
        } else {
            const [ref, param] = setParam;
            return `${ref.getCypher(env)} = ${param.getCypher(env)}`;
        }
    }
}
