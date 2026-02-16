/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../../../Environment";
import type { Clause } from "../../../clauses/Clause";
import { CypherFunction } from "../../../expressions/functions/CypherFunctions";
import { MapExpr } from "../../../expressions/map/MapExpr";
import type { Variable } from "../../../references/Variable";
import type { Expr } from "../../../types";

/**
 * @group Functions
 * @deprecated apoc methods will no longer be supported in Cypher Builder version 3
 * @see [Apoc Documentation](https://neo4j.com/docs/apoc/current/overview/apoc.cypher/apoc.cypher.runFirstColumnMany/)
 */
export function runFirstColumnMany(
    clause: Clause | string,
    params: Variable[] | MapExpr | Record<string, Expr> = []
): CypherFunction {
    return new RunFirstColumnFunction(clause, params, true);
}

/**
 * @group Functions
 * @deprecated apoc methods will no longer be supported in Cypher Builder version 3
 * @see [Apoc Documentation](https://neo4j.com/docs/apoc/current/overview/apoc.cypher/apoc.cypher.runFirstColumnSingle/)
 */
export function runFirstColumnSingle(
    clause: Clause | string,
    params: Variable[] | MapExpr | Record<string, Expr> = []
): CypherFunction {
    return new RunFirstColumnFunction(clause, params, false);
}

class RunFirstColumnFunction extends CypherFunction {
    private readonly innerClause: Clause | string;
    private readonly variables: Variable[] | MapExpr;
    private readonly many: boolean;

    constructor(clause: Clause | string, variables: Variable[] | MapExpr | Record<string, Expr>, many: boolean) {
        super(`apoc.cypher.runFirstColumn${many ? "Many" : "Single"}`); // Note: this argument is never used

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
        return query.replaceAll(/(["\\])/g, "\\$1");
    }

    private parseVariablesInput(variables: Variable[] | MapExpr | Record<string, Expr>): Variable[] | MapExpr {
        if (Array.isArray(variables) || variables instanceof MapExpr) return variables;
        return new MapExpr(variables);
    }

    private convertArrayToParams(env: CypherEnvironment, variables: Variable[]): string {
        const params = variables.reduce((acc: Record<string, string>, variable) => {
            const globalScopeName = variable.getCypher(env);
            const key = env.getReferenceId(variable);
            acc[key] = globalScopeName;
            return acc;
        }, {});

        const paramsStr = Object.entries(params)
            .map(([key, value]) => {
                return `${key}: ${value}`;
            })
            .join(", ");
        return `{ ${paramsStr} }`;
    }
}
