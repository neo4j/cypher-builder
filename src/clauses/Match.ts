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

import type { CypherEnvironment } from "../Environment";
import type { PathAssign } from "../pattern/PathAssign";
import { Pattern } from "../pattern/Pattern";
import type { QuantifiedPath } from "../pattern/quantified-patterns/QuantifiedPath";
import { NodeRef } from "../references/NodeRef";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { Clause } from "./Clause";
import { WithPathAssign } from "./mixins/WithPathAssign";
import { WithCall } from "./mixins/clauses/WithCall";
import { WithCallProcedure } from "./mixins/clauses/WithCallProcedure";
import { WithCreate } from "./mixins/clauses/WithCreate";
import { WithFinish } from "./mixins/clauses/WithFinish";
import { WithMerge } from "./mixins/clauses/WithMerge";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithUnwind } from "./mixins/clauses/WithUnwind";
import { WithWith } from "./mixins/clauses/WithWith";
import { WithDelete } from "./mixins/sub-clauses/WithDelete";
import { WithOrder } from "./mixins/sub-clauses/WithOrder";
import { WithRemove } from "./mixins/sub-clauses/WithRemove";
import { WithSet } from "./mixins/sub-clauses/WithSet";
import { WithWhere } from "./mixins/sub-clauses/WithWhere";
import { mixin } from "./utils/mixin";

export interface Match
    extends WithReturn,
        WithWhere,
        WithSet,
        WithWith,
        WithPathAssign,
        WithDelete,
        WithRemove,
        WithUnwind,
        WithCreate,
        WithMerge,
        WithFinish,
        WithCallProcedure,
        WithCall,
        WithOrder {}

type ShortestStatement = {
    type: "ALL SHORTEST" | "SHORTEST" | "ANY" | "SHORTEST_GROUPS";
    k?: number;
};

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/match/)
 * @category Clauses
 */
@mixin(
    WithReturn,
    WithWhere,
    WithSet,
    WithWith,
    WithPathAssign,
    WithDelete,
    WithRemove,
    WithUnwind,
    WithCreate,
    WithMerge,
    WithFinish,
    WithCallProcedure,
    WithCall,
    WithOrder
)
export class Match extends Clause {
    private readonly pattern: Pattern | QuantifiedPath | PathAssign<Pattern | QuantifiedPath>;
    private _optional = false;
    private shortestStatement: ShortestStatement | undefined;

    constructor(pattern: Pattern | QuantifiedPath | PathAssign<Pattern | QuantifiedPath>);
    /** @deprecated Use {@link Pattern} instead of node: `new Cypher.Match(new Cypher.Pattern(node))` */
    constructor(node: NodeRef | Pattern | QuantifiedPath);
    constructor(pattern: NodeRef | Pattern | QuantifiedPath | PathAssign<Pattern | QuantifiedPath>) {
        super();

        // NOTE: deprecated behaviour
        if (pattern instanceof NodeRef) {
            this.pattern = new Pattern(pattern);
        } else {
            this.pattern = pattern;
        }
    }

    /** Makes the clause an OPTIONAL MATCH
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/optional-match/)
     * @example
     * ```ts
     * new Cypher.Match(new Node({labels: ["Movie"]})).optional();
     * ```
     * _Cypher:_
     * ```cypher
     * OPTIONAL MATCH (this:Movie)
     * ```
     */
    public optional(): this {
        this._optional = true;
        return this;
    }

    /** Add a {@link Match} clause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/match/)
     */
    public match(clause: Match): Match;
    public match(pattern: Pattern): Match;
    /** @deprecated Use {@link Pattern} instead */
    public match(pattern: NodeRef | Pattern): Match;
    public match(clauseOrPattern: Match | NodeRef | Pattern): Match {
        if (clauseOrPattern instanceof Match) {
            this.addNextClause(clauseOrPattern);
            return clauseOrPattern;
        }

        const matchClause = new Match(clauseOrPattern);
        this.addNextClause(matchClause);

        return matchClause;
    }

    /** Add an {@link OptionalMatch} clause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/optional-match/)
     */
    public optionalMatch(pattern: Pattern): OptionalMatch;
    /** @deprecated Use {@link Pattern} instead */
    public optionalMatch(pattern: NodeRef | Pattern): OptionalMatch;
    public optionalMatch(pattern: NodeRef | Pattern): OptionalMatch {
        const matchClause = new OptionalMatch(pattern);
        this.addNextClause(matchClause);

        return matchClause;
    }

    public shortest(k: number): this {
        this.shortestStatement = {
            type: "SHORTEST",
            k,
        };
        return this;
    }
    public shortestGroups(k: number): this {
        this.shortestStatement = {
            type: "SHORTEST_GROUPS",
            k,
        };
        return this;
    }
    public allShortest(): this {
        this.shortestStatement = {
            type: "ALL SHORTEST",
        };
        return this;
    }
    public any(): this {
        this.shortestStatement = {
            type: "ANY",
        };
        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const pathAssignStr = this.compilePath(env);

        const patternCypher = this.pattern.getCypher(env);

        const whereCypher = compileCypherIfExists(this.whereSubClause, env, { prefix: "\n" });

        const nextClause = this.compileNextClause(env);
        const setCypher = compileCypherIfExists(this.setSubClause, env, { prefix: "\n" });
        const deleteCypher = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const removeCypher = compileCypherIfExists(this.removeClause, env, { prefix: "\n" });
        const orderByCypher = compileCypherIfExists(this.orderByStatement, env, { prefix: "\n" });
        const optionalMatch = this._optional ? "OPTIONAL " : "";
        const shortestStatement = this.getShortestStatement();

        return `${optionalMatch}MATCH ${shortestStatement}${pathAssignStr}${patternCypher}${whereCypher}${setCypher}${removeCypher}${deleteCypher}${orderByCypher}${nextClause}`;
    }

    private getShortestStatement(): string {
        if (!this.shortestStatement) {
            return "";
        }
        switch (this.shortestStatement.type) {
            case "SHORTEST":
                return `SHORTEST ${this.shortestStatement.k} `;
            case "ALL SHORTEST":
                return "ALL SHORTEST ";
            case "SHORTEST_GROUPS":
                return `SHORTEST ${this.shortestStatement.k} GROUPS `;
            case "ANY":
                return "ANY ";
        }
    }
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/optional-match/)
 * @category Clauses
 */
export class OptionalMatch extends Match {
    constructor(pattern: Pattern);
    /** @deprecated Use a {@link Pattern} instead */
    constructor(pattern: NodeRef | Pattern);
    constructor(pattern: NodeRef | Pattern) {
        super(pattern);
        this.optional();
    }
}
