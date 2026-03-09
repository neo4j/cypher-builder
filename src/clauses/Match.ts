/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment.js";
import type { PathAssign } from "../pattern/PathAssign.js";
import type { Pattern } from "../pattern/Pattern.js";
import type { QuantifiedPath } from "../pattern/quantified-patterns/QuantifiedPath.js";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists.js";
import { Clause } from "./Clause.js";
import { WithCall } from "./mixins/clauses/WithCall.js";
import { WithCallProcedure } from "./mixins/clauses/WithCallProcedure.js";
import { WithCreate } from "./mixins/clauses/WithCreate.js";
import { WithFinish } from "./mixins/clauses/WithFinish.js";
import { WithForeach } from "./mixins/clauses/WithForeach.js";
import { WithMerge } from "./mixins/clauses/WithMerge.js";
import { WithReturn } from "./mixins/clauses/WithReturn.js";
import { WithUnwind } from "./mixins/clauses/WithUnwind.js";
import { WithWith } from "./mixins/clauses/WithWith.js";
import { WithDelete } from "./mixins/sub-clauses/WithDelete.js";
import { WithOrder } from "./mixins/sub-clauses/WithOrder.js";
import { WithSetRemove } from "./mixins/sub-clauses/WithSetRemove.js";
import { WithWhere } from "./mixins/sub-clauses/WithWhere.js";
import { mixin } from "./utils/mixin.js";

export interface Match
    extends
        WithReturn,
        WithWhere,
        WithSetRemove,
        WithWith,
        WithDelete,
        WithUnwind,
        WithCreate,
        WithMerge,
        WithFinish,
        WithCallProcedure,
        WithCall,
        WithOrder,
        WithForeach {}

type ShortestStatement = {
    type: "ALL SHORTEST" | "SHORTEST" | "ANY" | "SHORTEST_GROUPS";
    k?: number;
};

/** Patterns supported by Match */
export type MatchClausePattern = Pattern | QuantifiedPath | PathAssign<Pattern | QuantifiedPath>;

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/match/ | Cypher Documentation}
 * @group Clauses
 */
@mixin(
    WithReturn,
    WithWhere,
    WithSetRemove,
    WithWith,
    WithDelete,
    WithUnwind,
    WithCreate,
    WithMerge,
    WithFinish,
    WithCallProcedure,
    WithCall,
    WithOrder,
    WithForeach
)
export class Match extends Clause {
    private readonly patterns: MatchClausePattern[];
    private _optional = false;
    private shortestStatement: ShortestStatement | undefined;

    constructor(...patterns: MatchClausePattern[]) {
        super();
        if (patterns.length === 0) {
            throw new Error("At least one pattern must be provided to Match");
        }
        this.patterns = patterns;
    }

    /** Makes the clause an OPTIONAL MATCH
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/optional-match/ | Cypher Documentation}
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
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/match/ | Cypher Documentation}
     */
    public match(clauseOrPattern: Match | MatchClausePattern): Match {
        if (clauseOrPattern instanceof Match) {
            this.addNextClause(clauseOrPattern);
            return clauseOrPattern;
        }

        const matchClause = new Match(clauseOrPattern);
        this.addNextClause(matchClause);

        return matchClause;
    }

    /** Add an {@link OptionalMatch} clause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/optional-match/ | Cypher Documentation}
     */
    public optionalMatch(clauseOrPattern: OptionalMatch | MatchClausePattern): OptionalMatch {
        if (clauseOrPattern instanceof OptionalMatch) {
            this.addNextClause(clauseOrPattern);
            return clauseOrPattern;
        }
        const matchClause = new OptionalMatch(clauseOrPattern);
        this.addNextClause(matchClause);

        return matchClause;
    }

    /**
     * @since Neo4j 5.21
     */
    public shortest(k: number): this {
        this.shortestStatement = {
            type: "SHORTEST",
            k,
        };
        return this;
    }

    /**
     * @since Neo4j 5.21
     */
    public shortestGroups(k: number): this {
        this.shortestStatement = {
            type: "SHORTEST_GROUPS",
            k,
        };
        return this;
    }

    /**
     * @since Neo4j 5.21
     */
    public allShortest(): this {
        this.shortestStatement = {
            type: "ALL SHORTEST",
        };
        return this;
    }

    /**
     * @since Neo4j 5.21
     */
    public any(): this {
        this.shortestStatement = {
            type: "ANY",
        };
        return this;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const patternCyphers = this.patterns.map((pattern) => pattern.getCypher(env));

        const whereCypher = compileCypherIfExists(this.whereSubClause, env, { prefix: "\n" });

        const nextClause = this.compileNextClause(env);
        const setCypher = this.compileSetCypher(env);
        const deleteCypher = compileCypherIfExists(this.deleteClause, env, { prefix: "\n" });
        const orderByCypher = compileCypherIfExists(this.orderByStatement, env, { prefix: "\n" });
        const optionalMatch = this._optional ? "OPTIONAL " : "";
        const shortestStatement = this.getShortestStatement();

        if (patternCyphers.length > 1 && shortestStatement) {
            throw new Error("Shortest cannot be used with multiple path patterns");
        }

        let patternStr: string;
        if (patternCyphers.length > 1) {
            patternStr = `\n${patternCyphers.map((p) => `  ${p}`).join(",\n")}`;
        } else {
            patternStr = ` ${shortestStatement}${patternCyphers[0]}`;
        }

        return `${optionalMatch}MATCH${patternStr}${whereCypher}${setCypher}${deleteCypher}${orderByCypher}${nextClause}`;
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
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/optional-match/ | Cypher Documentation}
 * @group Clauses
 */
export class OptionalMatch extends Match {
    constructor(...patterns: MatchClausePattern[]) {
        super(...patterns);
        this.optional();
    }
}
