/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../../Environment.js";
import type { CypherCompilable, Expr } from "../../types.js";
import type { ListIndex } from "./ListIndex.js";
import { listIndex } from "./ListIndex.js";
import type { ListRange } from "./ListRange.js";
import { listRange } from "./ListRange.js";

/** Represents a List
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/lists/ | Cypher Documentation}
 * @group Lists
 * @example
 * ```ts
 * new Cypher.List([new Cypher.Literal("1"), new Cypher.Literal("2"), new Cypher.Literal("3")])
 * ```
 * Translates to
 * ```cypher
 * [ "1", "2", "3" ]
 * ```
 */
export class ListExpr implements CypherCompilable {
    private readonly value: Expr[];

    constructor(value: Expr[]) {
        this.value = value;
    }

    private serializeList(env: CypherEnvironment, obj: Expr[]): string {
        const valuesList = obj.map((expr) => {
            return expr.getCypher(env);
        });

        const serializedContent = valuesList.join(", ");
        return `[${serializedContent}]`;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        return this.serializeList(env, this.value);
    }

    /** Access individual elements in the list */
    public index(index: number): ListIndex {
        return listIndex(this, index);
    }

    /** Adds a list range operator (`[ .. ]`) */
    public range(from: number, to: number): ListRange {
        return listRange(this, from, to);
    }
}
