/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment";
import type { PathAssign } from "../pattern/PathAssign";
import type { Pattern } from "../pattern/Pattern";
import type { QuantifiedPath } from "../pattern/quantified-patterns/QuantifiedPath";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { Clause } from "./Clause";
import { WithCall } from "./mixins/clauses/WithCall";
import { WithCallProcedure } from "./mixins/clauses/WithCallProcedure";
import { WithCreate } from "./mixins/clauses/WithCreate";
import { WithFilter } from "./mixins/clauses/WithFilter";
import { WithFinish } from "./mixins/clauses/WithFinish";
import { WithForeach } from "./mixins/clauses/WithForeach";
import { WithLet } from "./mixins/clauses/WithLet";
import { WithMerge } from "./mixins/clauses/WithMerge";
import { WithReturn } from "./mixins/clauses/WithReturn";
import { WithUnwind } from "./mixins/clauses/WithUnwind";
import { WithWith } from "./mixins/clauses/WithWith";
import { WithDelete } from "./mixins/sub-clauses/WithDelete";
import { WithOrder } from "./mixins/sub-clauses/WithOrder";
import { WithSetRemove } from "./mixins/sub-clauses/WithSetRemove";
import { WithWhere } from "./mixins/sub-clauses/WithWhere";
import { mixin } from "./utils/mixin";

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
        WithForeach,
        WithLet,
        WithFilter {}

enum MatchMode {
    REPEATABLE_ELEMENTS,
    DIFFERENT_RELATIONSHIPS,
}

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
    WithForeach,
    WithLet,
    WithFilter
)
export class Match extends Clause {
    private readonly patterns: MatchClausePattern[];
    private _optional = false;
    private shortestStatement: ShortestStatement | undefined;
    private mode: MatchMode | undefined;

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

    /** Add `REPEATABLE ELEMENTS` mode to `MATCH` clause
     * @see {@link https://neo4j.com/docs/cypher-manual/25/patterns/match-modes/#repeatable-elements | Cypher Documentation}
     * @since Neo4j 2025.06
     */
    public repeatableElements(): this {
        this.mode = MatchMode.REPEATABLE_ELEMENTS;
        return this;
    }

    /** Add `DIFFERENT RELATIONSHIPS` mode to `MATCH` clause
     * @see {@link https://neo4j.com/docs/cypher-manual/25/patterns/match-modes/#different-relationships | Cypher Documentation}
     * @since Neo4j 2025.06
     */
    public differentRelationships(): this {
        this.mode = MatchMode.DIFFERENT_RELATIONSHIPS;
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
            patternStr = `${patternCyphers.map((p) => `\n  ${p}`).join(",")}`;
        } else {
            patternStr = ` ${shortestStatement}${patternCyphers[0]}`;
        }

        const modeStr = this.getModeStr();

        return `${optionalMatch}MATCH${modeStr}${patternStr}${whereCypher}${setCypher}${deleteCypher}${orderByCypher}${nextClause}`;
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

    private getModeStr(): string {
        switch (this.mode) {
            case MatchMode.DIFFERENT_RELATIONSHIPS:
                return " DIFFERENT RELATIONSHIPS";
            case MatchMode.REPEATABLE_ELEMENTS:
                return " REPEATABLE ELEMENTS";
            default:
                return "";
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
