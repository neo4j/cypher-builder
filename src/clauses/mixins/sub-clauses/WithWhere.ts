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

import { and } from "../../../expressions/operations/boolean";
import { eq } from "../../../expressions/operations/comparison";
import type { Literal } from "../../../references/Literal";
import { PropertyRef } from "../../../references/PropertyRef";
import { Variable } from "../../../references/Variable";
import type { Predicate } from "../../../types";
import { Where } from "../../sub-clauses/Where";
import { Mixin } from "../Mixin";

export type VariableLike = Variable | Literal | PropertyRef;

export abstract class WithWhere extends Mixin {
    protected whereSubClause: Where | undefined;

    /** Add a `WHERE` subclause
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/clauses/where/)
     */
    public where(input: Predicate | undefined): this;
    public where(target: Variable | PropertyRef, params: Record<string, VariableLike>): this;
    public where(input: Predicate | Variable | PropertyRef | undefined, params?: Record<string, VariableLike>): this {
        this.updateOrCreateWhereClause(input, params);
        return this;
    }

    /** Shorthand for `AND` operation after a `WHERE` subclause
     */
    public and(input: Predicate | undefined): this;
    public and(target: Variable | PropertyRef, params: Record<string, VariableLike>): this;
    public and(input: Predicate | Variable | PropertyRef | undefined, params?: Record<string, VariableLike>): this {
        this.updateOrCreateWhereClause(input, params);
        return this;
    }

    private updateOrCreateWhereClause(
        input: Predicate | Variable | PropertyRef | undefined,
        params?: Record<string, VariableLike>
    ): void {
        const whereInput = this.createWhereInput(input, params);
        if (!whereInput) {
            return;
        }

        if (!this.whereSubClause) {
            const whereClause = new Where(this, whereInput);
            this.whereSubClause = whereClause;
        } else {
            this.whereSubClause.and(whereInput);
        }
    }

    private createWhereInput(
        input: Predicate | Variable | PropertyRef | undefined,
        params: Record<string, VariableLike> | undefined
    ): Predicate | undefined {
        if (!input) {
            return undefined;
        }
        if (input instanceof Variable || input instanceof PropertyRef) {
            const generatedOp = this.variableAndObjectToOperation(input, params ?? {});
            return generatedOp;
        }
        return input;
    }

    /** Transforms a simple input into an operation sub tree */
    private variableAndObjectToOperation(
        target: Variable | PropertyRef,
        params: Record<string, VariableLike>
    ): Predicate | undefined {
        let operation: Predicate | undefined;
        for (const [key, value] of Object.entries(params)) {
            const property = target.property(key);
            const eqOp = eq(property, value);
            if (!operation) operation = eqOp;
            else {
                operation = and(operation, eqOp);
            }
        }
        return operation;
    }
}
