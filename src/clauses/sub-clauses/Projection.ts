/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { Literal } from "../../references/Literal";
import type { Variable } from "../../references/Variable";
import type { Expr } from "../../types";

/** @group Clauses */
export type ProjectionColumn = Expr | [Expr, string | Variable | Literal];

export class Projection extends CypherASTNode {
    private readonly columns: ProjectionColumn[] = [];
    private isStar = false;

    constructor(columns: Array<"*" | ProjectionColumn>) {
        super();

        this.addColumns(columns);
    }

    public addColumns(columns: Array<"*" | ProjectionColumn>): void {
        const filteredColumns = columns.filter((v) => {
            if (v === "*") {
                this.isStar = true;
                return false;
            }
            return true;
        }) as ProjectionColumn[];
        this.columns.push(...filteredColumns);
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        let columnsStrs = this.columns.map((column) => {
            return this.serializeColumn(column, env);
        });

        // Only a single star at the beginning is allowed
        if (this.isStar) {
            columnsStrs = ["*", ...columnsStrs];
        }

        return columnsStrs.join(", ");
    }

    private serializeColumn(column: ProjectionColumn, env: CypherEnvironment): string {
        const hasAlias = Array.isArray(column);
        if (hasAlias) {
            const exprStr = column[0].getCypher(env);
            const alias = column[1];
            let aliasStr: string;
            if (typeof alias === "string") {
                aliasStr = alias;
            } else {
                aliasStr = alias.getCypher(env);
            }

            return `${exprStr} AS ${aliasStr}`;
        }
        return column.getCypher(env);
    }
}
