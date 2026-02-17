/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherCompilable } from "../types";
import { escapeLiteralString } from "../utils/escape";

/**
 * Possible types of a {@link Literal} expression
 * @group Expressions
 */
export type LiteralValue = string | number | boolean | null | Array<LiteralValue>;

/** Represents a literal value
 * @group Expressions
 */
export class Literal<T extends LiteralValue = LiteralValue> implements CypherCompilable {
    public value: T;

    constructor(value: T) {
        this.value = value;
    }

    /** @internal */
    public getCypher(): string {
        return this.formatLiteralValue(this.value);
    }

    private formatLiteralValue(value: LiteralValue): string {
        if (typeof value === "string") {
            return `"${escapeLiteralString(value)}"`;
        }
        if (value === null) {
            return "NULL";
        }
        if (Array.isArray(value)) {
            const serializedValues = value.map((v) => this.formatLiteralValue(v));
            return `[${serializedValues.join(", ")}]`;
        }
        return `${value}`;
    }
}

/** Represents a `NULL` literal value
 * @group Expressions
 */
export const CypherNull = new Literal(null);

/** Represents a `true` literal value
 * @group Expressions
 */
export const CypherTrue = new Literal(true);

/** Represents a `false` literal value
 * @group Expressions
 */
export const CypherFalse = new Literal(false);
