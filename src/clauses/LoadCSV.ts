/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Variable } from "../index.js";
import type { CypherEnvironment } from "../Environment.js";
import { Clause } from "./Clause.js";
import { WithCallProcedure } from "./mixins/clauses/WithCallProcedure.js";
import { WithCreate } from "./mixins/clauses/WithCreate.js";
import { WithMerge } from "./mixins/clauses/WithMerge.js";
import { WithReturn } from "./mixins/clauses/WithReturn.js";
import { WithWith } from "./mixins/clauses/WithWith.js";
import { WithWhere } from "./mixins/sub-clauses/WithWhere.js";
import { mixin } from "./utils/mixin.js";

export interface LoadCSV extends WithReturn, WithCreate, WithMerge, WithWith, WithWhere, WithCallProcedure {}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/load-csv/ | Cypher Documentation}
 * @group Clauses
 */
@mixin(WithReturn, WithCreate, WithMerge, WithWith, WithWhere, WithCallProcedure)
export class LoadCSV extends Clause {
    private readonly url: string;
    private readonly alias: Variable;

    private _withHeaders = false;

    constructor(url: string, alias: Variable) {
        super();
        this.url = url;
        this.alias = alias;
    }

    public withHeaders(): this {
        this._withHeaders = true;
        return this;
    }

    /**
     *  @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const aliasStr = this.alias.getCypher(env);
        const nextClause = this.compileNextClause(env);
        const withHeadersStr = this._withHeaders ? "WITH HEADERS " : "";
        return `LOAD CSV ${withHeadersStr}FROM "${this.url}" AS ${aliasStr}${nextClause}`;
    }
}
