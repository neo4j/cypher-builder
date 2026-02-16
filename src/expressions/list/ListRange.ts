/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../../Environment";
import type { CypherCompilable, Expr } from "../../types";

/**
 * @group Lists
 */
export class ListRange implements CypherCompilable {
    private readonly value: Expr;
    private readonly from: number;
    private readonly to: number;

    /**
     * @internal
     */
    constructor(variable: Expr, from: number, to: number) {
        this.value = variable;
        this.from = from;
        this.to = to;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        return `${this.value.getCypher(env)}[${this.from}..${this.to}]`;
    }
}

/** Adds a list range operator (`[ .. ]`) to an expression
 * @example
 * ```cypher
 * collect(var)[1..2]
 * ```
 */
export function listRange(expr: Expr, from: number, to: number): ListRange {
    return new ListRange(expr, from, to);
}
