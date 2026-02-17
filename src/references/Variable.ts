/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment";
import type { ListIndex } from "../expressions/list/ListIndex";
import { listIndex } from "../expressions/list/ListIndex";
import type { Expr } from "../types";
import { escapeVariable } from "../utils/escape";
import { PropertyRef } from "./PropertyRef";

/** Represents a variable
 * @group Variables
 */
export class Variable {
    /**
     * @internal
     */
    public prefix: string = "var";

    /** Access individual property via the PropertyRef class */
    public property(...path: Array<string | Expr>): PropertyRef {
        return new PropertyRef(this, ...path);
    }

    // NOTE: duplicate in ListExpr
    /* Adds a index access operator (`[ ]`) to the variable */
    public index(index: number): ListIndex {
        return listIndex(this, index);
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const id = env.getReferenceId(this);
        return escapeVariable(id);
    }
}

/** @internal */
export interface NamedReference extends Variable {
    readonly id: string;
}

/**
 * Represents a variable with a explicit name
 * @group Variables
 */
export class NamedVariable extends Variable implements NamedReference {
    public readonly id: string;

    constructor(name: string) {
        super();
        this.id = name;
        this.prefix = "";
    }
}
