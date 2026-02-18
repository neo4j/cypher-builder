/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Label } from "../../..";
import type { CypherEnvironment } from "../../../Environment";
import type { PropertyRef } from "../../../references/PropertyRef";
import { compileCypherIfExists } from "../../../utils/compile-cypher-if-exists";
import { RemoveClause } from "../../sub-clauses/Remove";
import type { SetParam } from "../../sub-clauses/Set";
import { SetClause } from "../../sub-clauses/Set";
import { Mixin } from "../Mixin";

export abstract class WithSetRemove extends Mixin {
    private subClauses: Array<SetClause | RemoveClause> | undefined;

    /** Append a `SET` clause. Allowing to assign variable properties to values.
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/set/ | Cypher Documentation}
     */
    public set(...params: SetParam[]): this {
        if (!this.subClauses) {
            this.subClauses = []; // Due to mixin wonkiness, we need to lazy initialize
        }

        const lastSubClause = this.subClauses.at(-1);
        if (lastSubClause instanceof SetClause) {
            lastSubClause.addParams(...params);
        } else {
            this.subClauses.push(new SetClause(this, params));
        }

        return this;
    }

    /** Append a `REMOVE` clause.
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/remove/ | Cypher Documentation}
     */
    public remove(...properties: Array<PropertyRef | Label>): this {
        if (!this.subClauses) {
            this.subClauses = []; // Due to mixin wonkiness, we need to lazy initialize
        }

        const lastSubClause = this.subClauses.at(-1);
        if (lastSubClause instanceof RemoveClause) {
            lastSubClause.addParams(...properties);
        } else {
            this.subClauses.push(new RemoveClause(this, properties));
        }

        return this;
    }

    protected compileSetCypher(env: CypherEnvironment): string {
        const subclausesCypher = (this.subClauses || [])
            .map((subclause) => {
                return compileCypherIfExists(subclause, env, { prefix: "\n" });
            })
            .join("");

        return subclausesCypher;
    }
}
