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

import { Clause } from "../clauses/Clause";
import { CypherASTNode } from "../CypherASTNode";
import type { CypherEnvironment } from "../Environment";
import type { Literal } from "../references/Literal";
import type { Param } from "../references/Param";
import type { Variable } from "../references/Variable";
import type { Expr } from "../types";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import type { YieldProjectionColumn } from "./Yield";
import { Yield } from "./Yield";

/** @group Procedures */
export type InputArgument<T extends string | number> = T | Variable | Literal<T> | Param<T>;

/** Cypher Procedure that does not yield columns
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/call/ | Cypher Documentation}
 * @group Procedures
 */
export class VoidCypherProcedure extends Clause {
    protected name: string;
    private readonly params: Array<Expr>;
    protected _optional: boolean = false;

    constructor(name: string, params: Array<Expr> = [], namespace?: string) {
        super();
        this.name = namespace ? `${namespace}.${name}` : name;
        this.params = params;
        for (const param of params) {
            if (param instanceof CypherASTNode) {
                this.addChildren(param);
            }
        }
    }

    public optional(): this {
        this._optional = true;
        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const procedureCypher = this.getProcedureCypher(env);
        const optionalStr = this.generateOptionalStr();
        return `${optionalStr}CALL ${procedureCypher}`;
    }

    private getProcedureCypher(env: CypherEnvironment): string {
        const argsStr = this.params.map((expr) => expr.getCypher(env)).join(", ");

        return `${this.name}(${argsStr})`;
    }

    protected generateOptionalStr(): string {
        return this._optional ? "OPTIONAL " : "";
    }
}

/** Cypher Procedure
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/call/ | Cypher Documentation}
 * @group Procedures
 */
export class CypherProcedure<T extends string = string> extends VoidCypherProcedure {
    private yieldStatement: Yield<T> | undefined;

    public yield(...columns: Array<"*" | YieldProjectionColumn<T>>): Yield<T> {
        if (columns.length === 0) throw new Error("Empty projection in CALL ... YIELD");
        this.yieldStatement = new Yield(columns);
        this.addChildren(this.yieldStatement);

        return this.yieldStatement;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const callCypher = super.getCypher(env);
        const yieldCypher = compileCypherIfExists(this.yieldStatement, env, { prefix: " " });

        return `${callCypher}${yieldCypher}`;
    }
}
