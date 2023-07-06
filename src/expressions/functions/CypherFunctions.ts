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
import type { Expr } from "../../types";

/** Represents a Cypher Function, all Cypher functions provided by the library extend from this class, and it can be used to use custom functions
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/)
 * @group Cypher Functions
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
    private params: Array<Expr> = [];

    constructor(name: string, params: Array<Expr> = []) {
        super();
        this.name = name;
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
