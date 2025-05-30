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

import type { Expr } from "../../../types";
import type { Order } from "../../sub-clauses/OrderBy";
import { OrderBy } from "../../sub-clauses/OrderBy";
import { Mixin } from "../Mixin";

const DEFAULT_ORDER = "ASC";

export abstract class WithOrder extends Mixin {
    protected orderByStatement: OrderBy | undefined;

    /** Add an `ORDER BY` subclause. Note that `ASC` is the default sorting order
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/order-by/ | Cypher Documentation}
     */
    public orderBy(...exprs: Array<[Expr, Order] | Expr | [Expr]>): this {
        const normalizedExprs = exprs.map((rawExpr): [Expr, Order] => {
            if (Array.isArray(rawExpr)) {
                return [rawExpr[0], rawExpr[1] ?? DEFAULT_ORDER];
            }
            return [rawExpr, DEFAULT_ORDER];
        });

        const orderByStatement = this.getOrCreateOrderBy();
        orderByStatement.addOrderElements(normalizedExprs);

        return this;
    }

    /** Add a `SKIP` subclause.
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/skip/ | Cypher Documentation}
     */
    public skip(value: number | Expr): this {
        const orderByStatement = this.getOrCreateOrderBy();
        orderByStatement.skip(value);
        return this;
    }

    /** Add a `OFFSET` subclause. An alias to `SKIP`
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/skip/#offset-synonym | Cypher Documentation}
     * @since Neo4j 5.24
     */
    public offset(value: number | Expr): this {
        const orderByStatement = this.getOrCreateOrderBy();
        orderByStatement.offset(value);
        return this;
    }

    /** Add a `LIMIT` subclause.
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/limit/ | Cypher Documentation}
     */
    public limit(value: number | Expr): this {
        const orderByStatement = this.getOrCreateOrderBy();
        orderByStatement.limit(value);
        return this;
    }

    private getOrCreateOrderBy(): OrderBy {
        if (!this.orderByStatement) this.orderByStatement = new OrderBy();
        return this.orderByStatement;
    }
}
