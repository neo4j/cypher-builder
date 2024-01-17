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

import { CypherASTNode } from "../CypherASTNode";
import type { EnvConfig, EnvPrefix } from "../Environment";
import { CypherEnvironment } from "../Environment";
import type { CypherResult } from "../types";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { padBlock } from "../utils/pad-block";
import { toCypherParams } from "../utils/to-cypher-params";

const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");

/** Config fields for the .build method */
export type BuildConfig = Partial<EnvConfig>;

/** Represents a clause AST node
 *  @group Internal
 */
export abstract class Clause extends CypherASTNode {
    protected nextClause: Clause | undefined;

    /** Compiles a clause into Cypher and params */
    public build(
        prefix?: string | EnvPrefix | undefined,
        extraParams: Record<string, unknown> = {},
        config?: BuildConfig
    ): CypherResult {
        if (this.isRoot) {
            const env = this.getEnv(prefix, config);
            const cypher = this.getCypher(env);

            const cypherParams = toCypherParams(extraParams);
            env.addExtraParams(cypherParams);
            return {
                cypher,
                params: env.getParams(),
            };
        }
        const root = this.getRoot();
        if (root instanceof Clause) {
            return root.build(prefix, extraParams);
        }
        throw new Error(`Cannot build root: ${root.constructor.name}`);
    }

    private getEnv(prefix?: string | EnvPrefix, config: BuildConfig = {}): CypherEnvironment {
        return new CypherEnvironment(prefix, config);
    }

    /** Custom string for browsers and templating
     * @hidden
     */
    public toString() {
        try {
            const cypher = padBlock(this.build().cypher);
            return `<Clause ${this.constructor.name}> """\n${cypher}\n"""`;
        } catch (error) {
            const errorName = error instanceof Error ? error.message : "";
            return `<Clause ${this.constructor.name}> """\nError: ${errorName}\n"""`;
        }
    }

    /** Custom log for console.log in Node
     * @hidden
     */
    [customInspectSymbol](): string {
        return this.toString();
    }

    protected addNextClause(clause: Clause): void {
        if (this.nextClause) {
            throw new Error("Cannot chain 2 top-level clauses to the same clause");
        }
        this.nextClause = clause;
        this.addChildren(this.nextClause);
    }

    protected compileNextClause(env: CypherEnvironment): string {
        return compileCypherIfExists(this.nextClause, env, { prefix: "\n" });
    }
}
