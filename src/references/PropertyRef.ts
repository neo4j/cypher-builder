/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment";
import { listIndex, type ListIndex } from "../expressions/list/ListIndex";
import type { ListRange } from "../expressions/list/ListRange";
import { listRange } from "../expressions/list/ListRange";
import type { CypherCompilable, Expr } from "../types";
import { escapeProperty } from "../utils/escape";
import type { Variable } from "./Variable";

/** Reference to a variable property
 * @group Variables
 * @example `new Node({labels: ["Movie"]}).property("title")`
 */
export class PropertyRef implements CypherCompilable {
    private readonly _variable: Variable;
    private readonly propertyPath: Array<string | Expr>;

    /**
     * @internal
     */
    constructor(variable: Variable, ...properties: Array<string | Expr>) {
        this._variable = variable;
        this.propertyPath = properties;
    }

    public get variable(): Variable {
        return this._variable;
    }

    /** Access individual property via the PropertyRef class, using dot notation or square brackets notation if an expression is provided */
    public property(prop: string | Expr): PropertyRef {
        return new PropertyRef(this._variable, ...this.propertyPath, prop);
    }

    /** Access individual elements in the list */
    public index(index: number): ListIndex {
        return listIndex(this, index);
    }

    /** Adds a list range operator (`[ .. ]`) */
    public range(from: number, to: number): ListRange {
        return listRange(this, from, to);
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const variableStr = this.variable.getCypher(env);

        const propStr = this.propertyPath.map((prop) => this.getPropertyCypher(prop, env)).join("");

        return `${variableStr}${propStr}`;
    }

    private getPropertyCypher(prop: string | Expr, env: CypherEnvironment): string {
        if (typeof prop === "string") {
            return `.${escapeProperty(prop)}`;
        } else {
            const exprStr = prop.getCypher(env);
            return `[${exprStr}]`;
        }
    }
}
