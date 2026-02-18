/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { Expr } from "../../types";

/** Represents a Cypher Function, all Cypher functions provided by the library extend from this class, and it can be used to use custom functions
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/ | Cypher Documentation}
 * @group Functions
 * @example
 * ```ts
 * const myFunction = new Cypher.Function("myFunction", [new Cypher.Literal("test"), new Cypher.Param("test2")]);
 * ```
 * _Cypher:_
 * ```cypher
 * myFunction("test", $param0)
 * ```
 */
export class CypherFunction extends CypherASTNode {
    protected name: string;
    private readonly params: Array<Expr> = [];

    constructor(name: string, params: Array<Expr> = [], namespace?: string) {
        super();
        this.name = namespace ? `${namespace}.${name}` : name;
        for (const param of params) {
            this.addParam(param);
        }
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const argsStr = this.serializeParams(env);

        return `${this.name}(${argsStr})`;
    }

    protected addParam(param: Expr): void {
        this.params.push(param);
        if (param instanceof CypherASTNode) {
            this.addChildren(param);
        }
    }

    protected serializeParams(env: CypherEnvironment): string {
        return this.params.map((expr) => expr.getCypher(env)).join(", ");
    }
}
