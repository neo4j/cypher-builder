/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherASTNode } from "../../CypherASTNode.js";
import type { CypherEnvironment } from "../../Environment.js";
import { filterTruthy } from "../../utils/filter-truthy.js";
import { Clause } from "../Clause.js";

/** The result of multiple clauses concatenated with `Cypher.utils.concat`
 * @group Utils
 */
export class CompositeClause extends Clause {
    protected _children: CypherASTNode[];

    /**
     * @internal
     */
    constructor(
        children: Array<Clause | undefined>,
        private readonly separator: string
    ) {
        super();
        this._children = [];
        this.concat(...children);
    }

    public concat(...clauses: Array<Clause | undefined>): this {
        const filteredChildren = this.filterClauses(clauses);
        this.addChildren(...filteredChildren);
        this._children = [...this._children, ...filteredChildren];
        return this;
    }

    public get empty(): boolean {
        return this._children.length === 0;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        // NOTE: importWithCypher used to pass down import WITH to UNION clauses
        const childrenStrs = this._children.map((c) => {
            return c.getCypher(env);
        });
        return childrenStrs.join(this.separator);
    }

    private filterClauses(clauses: Array<Clause | undefined>): CypherASTNode[] {
        const childrenRoots = filterTruthy(clauses).map((c) => c.getRoot());

        return this.filterEmptyComposite(childrenRoots).map((c) => {
            if (c instanceof CompositeClause) {
                return this.unwrapComposite(c);
            }
            return c;
        });
    }

    private filterEmptyComposite(children: Array<CypherASTNode>): Array<CypherASTNode> {
        return children.filter((c) => {
            if (c instanceof CompositeClause && c.empty) return false;
            return true;
        });
    }

    private unwrapComposite(clause: CompositeClause): CypherASTNode {
        if (clause._children.length === 1) {
            return clause._children[0]!;
        } else return clause;
    }
}
