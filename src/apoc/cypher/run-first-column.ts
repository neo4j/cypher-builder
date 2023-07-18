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

import type { Clause } from "../../clauses/Clause";
import type { Variable } from "../../references/Variable";
import type { CypherEnvironment } from "../../Environment";
import { MapExpr } from "../../expressions/map/MapExpr";
import { CypherFunction } from "../../expressions/functions/CypherFunctions";
import type { Expr } from "../../types";

/**
 * @group Cypher Functions
 * @see [Apoc Documentation](https://neo4j.com/docs/apoc/current/overview/apoc.cypher/apoc.cypher.runFirstColumnMany/)
 */
export function runFirstColumnMany(
    clause: Clause | string,
    params: Variable[] | MapExpr | Record<string, Expr> = []
): CypherFunction {
    return new RunFirstColumnFunction(clause, params, true);
}

/**
 * @group Cypher Functions
 * @see [Apoc Documentation](https://neo4j.com/docs/apoc/current/overview/apoc.cypher/apoc.cypher.runFirstColumnSingle/)
 */
export function runFirstColumnSingle(
    clause: Clause | string,
    params: Variable[] | MapExpr | Record<string, Expr> = []
): CypherFunction {
    return new RunFirstColumnFunction(clause, params, false);
}

class RunFirstColumnFunction extends CypherFunction {
    private innerClause: Clause | string;
    private variables: Variable[] | MapExpr;
    private many: boolean;

    constructor(clause: Clause | string, variables: Variable[] | MapExpr | Record<string, Expr>, many: boolean) {
        super(`apoc.cypher.runFirstColumn${many ? "Many" : "Single"}`);

        this.innerClause = clause;
        this.variables = this.parseVariablesInput(variables);
        this.many = many;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        let clauseStr: string;
        let paramsStr: string;
        if (typeof this.innerClause === "string") {
            clauseStr = this.innerClause;
        } else {
            clauseStr = this.innerClause.getRoot().getCypher(env);
        }

        if (Array.isArray(this.variables)) {
            paramsStr = this.convertArrayToParams(env, this.variables);
        } else {
            paramsStr = this.variables.getCypher(env);
        }

        if (this.many) {
            return `apoc.cypher.runFirstColumnMany("${this.escapeQuery(clauseStr)}", ${paramsStr})`;
        }

        return `apoc.cypher.runFirstColumnSingle("${this.escapeQuery(clauseStr)}", ${paramsStr})`;
    }

    private escapeQuery(query: string): string {
        return query.replace(/("|\\)/g, "\\$1");
    }

    private parseVariablesInput(variables: Variable[] | MapExpr | Record<string, Expr>): Variable[] | MapExpr {
        if (Array.isArray(variables) || variables instanceof MapExpr) return variables;
        return new MapExpr(variables);
    }

    private convertArrayToParams(env: CypherEnvironment, variables: Variable[]): string {
        const params = variables.reduce((acc, variable) => {
            const globalScopeName = variable.getCypher(env);
            const key = env.getReferenceId(variable);
            acc[key] = globalScopeName;
            return acc;
        }, {} as Record<string, string>);

        const paramsStr = Object.entries(params)
            .map(([key, value]) => {
                return `${key}: ${value}`;
            })
            .join(", ");
        return `{ ${paramsStr} }`;
    }
}
