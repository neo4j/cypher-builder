/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../../Environment";
import type { CypherCompilable, Expr } from "../../types";

/**
 * @group Lists
 */
export class ListIndex implements CypherCompilable {
    private readonly value: Expr;
    private readonly index: number;

    /**
     * @internal
     */
    constructor(variable: Expr, index: number) {
        this.value = variable;
        this.index = index;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        return `${this.value.getCypher(env)}[${this.index}]`;
    }
}

/** Adds a index access operator (`[ ]`) to an expression
 * @example
 * ```cypher
 * collect(var)[0]
 * ```
 */
export function listIndex(expr: Expr, index: number): ListIndex {
    return new ListIndex(expr, index);
}
