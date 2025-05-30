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

import type { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import { filterTruthy } from "../../utils/filter-truthy";
import { Clause } from "../Clause";
import { Union } from "../Union";

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

    /** @deprecated Children from a composite clause should not be accessed as this will lead to unexpected behaviour */
    public get children(): Array<CypherASTNode> {
        return this._children;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment, importWithCypher?: string): string {
        // NOTE: importWithCypher used to pass down import WITH to UNION clauses
        const childrenStrs = this._children.map((c) => {
            if (importWithCypher && c instanceof Union) {
                return c.getCypher(env, importWithCypher);
            }
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
