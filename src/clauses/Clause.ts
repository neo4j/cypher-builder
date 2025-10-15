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
import { CypherEnvironment } from "../Environment";
import type { CypherResult } from "../types";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { padBlock } from "../utils/pad-block";
import { toCypherParams } from "../utils/to-cypher-params";

const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");

/** Config fields of the .build() method
 * @group Clauses
 */
export type BuildConfig = Partial<{
    /** Will prefix generated queries with the Cypher version
     * @example `CYPHER 5`
     */
    cypherVersion: "5";
    /** Prefix variables with given string.
     *
     * This is useful to avoid name collisions if separate Cypher queries are generated and merged after generating the strings.
     * @example `myPrefix_this0`
     *
     */
    prefix: string;
    /** Extra parameters to be added to the result of `.build`. */
    extraParams: Record<string, unknown>;
    /** Options for disabling automatic escaping of potentially unsafe strings.
     *
     * **WARNING**: Changing these options may lead to code injection and unsafe Cypher.
     */
    unsafeEscapeOptions: Partial<{
        /** Disables automatic escaping of node labels.
         *
         * If disabled, any labels passed should be properly escaped with `utils.escapeLabel`.
         *
         * **WARNING**: Disabling label escaping may lead to code injection and unsafe Cypher.
         */
        disableNodeLabelEscaping: boolean;
        /** Disables automatic escaping of relationship types.
         *
         * If disabled, any types passed should be properly escaped with `utils.escapeType`.
         *
         * **WARNING**: Disabling type escaping may lead to code injection and unsafe Cypher.
         */
        disableRelationshipTypeEscaping: boolean;
    }>;
}>;

/** Represents a clause AST node
 *  @group Clauses
 */
export abstract class Clause extends CypherASTNode {
    protected nextClause: Clause | undefined;

    /** Compiles a clause into Cypher and params */
    public build(config?: BuildConfig): CypherResult {
        const { prefix, extraParams = {}, cypherVersion, unsafeEscapeOptions = {} } = config ?? {};

        if (this.isRoot) {
            const env = this.getEnv(prefix, {
                cypherVersion,
                unsafeEscapeOptions,
            });
            const cypher = this.getCypher(env);

            const cypherParams = toCypherParams(extraParams);
            env.addExtraParams(cypherParams);
            return {
                cypher: this.prependCypherVersionClause(cypher, cypherVersion),
                params: env.getParams(),
            };
        }
        const root = this.getRoot();
        if (root instanceof Clause) {
            return root.build({ prefix, extraParams, cypherVersion, unsafeEscapeOptions });
        }
        throw new Error(`Cannot build root: ${root.constructor.name}`);
    }

    private getEnv(prefix?: string, config: BuildConfig = {}): CypherEnvironment {
        return new CypherEnvironment(prefix, config);
    }

    private prependCypherVersionClause(cypher: string, version: BuildConfig["cypherVersion"]): string {
        let cypherVersionStr = "";
        if (version) {
            cypherVersionStr = `CYPHER ${version}\n`;
        }

        return `${cypherVersionStr}${cypher}`;
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
            throw new Error(
                `Cannot add <Clause ${clause.constructor.name}> to <Clause ${this.constructor.name}> because ${this.constructor.name} it is not the last clause.`
            );
        }
        this.nextClause = clause;
        this.addChildren(this.nextClause);
    }

    protected compileNextClause(env: CypherEnvironment): string {
        return compileCypherIfExists(this.nextClause, env, { prefix: "\n" });
    }
}
