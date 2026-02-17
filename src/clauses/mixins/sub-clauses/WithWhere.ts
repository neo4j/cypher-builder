/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { BooleanOp } from "../../../expressions/operations/boolean";
import { and } from "../../../expressions/operations/boolean";
import type { ComparisonOp } from "../../../expressions/operations/comparison";
import { eq } from "../../../expressions/operations/comparison";
import type { Literal } from "../../../references/Literal";
import { PropertyRef } from "../../../references/PropertyRef";
import { Variable } from "../../../references/Variable";
import type { Predicate } from "../../../types";
import { Where } from "../../sub-clauses/Where";
import { Mixin } from "../Mixin";

/** @inline */
type VariableLike = Variable | Literal | PropertyRef;

/** @inline */
type WhereInputOrTarget = Predicate | Variable | PropertyRef | undefined;

export abstract class WithWhere extends Mixin {
    protected whereSubClause: Where | undefined;

    /** Add a `WHERE` subclause
     * @see {@link https://neo4j.com/docs/cypher-manual/current/clauses/where/ | Cypher Documentation}
     */
    public where(input: Predicate | undefined): this;
    public where(target: Variable | PropertyRef, params: Record<string, VariableLike>): this;
    public where(inputOrTarget: WhereInputOrTarget, params?: Record<string, VariableLike>): this {
        this.updateOrCreateWhereClause(inputOrTarget, params);
        return this;
    }

    /** Shorthand for `AND` operation after a `WHERE` subclause
     */
    public and(input: Predicate | undefined): this;
    public and(target: Variable | PropertyRef, params: Record<string, VariableLike>): this;
    public and(inputOrTarget: WhereInputOrTarget, params?: Record<string, VariableLike>): this {
        this.updateOrCreateWhereClause(inputOrTarget, params);
        return this;
    }

    private updateOrCreateWhereClause(inputOrTarget: WhereInputOrTarget, params?: Record<string, VariableLike>): void {
        const whereInput = this.createWhereInput(inputOrTarget, params);
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
        inputOrTarget: WhereInputOrTarget,
        params: Record<string, VariableLike> | undefined
    ): Predicate | undefined {
        if (!inputOrTarget) {
            return undefined;
        }
        if (inputOrTarget instanceof Variable || inputOrTarget instanceof PropertyRef) {
            const generatedOp = this.variableAndObjectToOperation(inputOrTarget, params ?? {});
            return generatedOp;
        }
        return inputOrTarget;
    }

    /** Transforms a simple input into an operation sub tree */
    private variableAndObjectToOperation(
        target: Variable | PropertyRef,
        params: Record<string, VariableLike>
    ): BooleanOp | ComparisonOp | undefined {
        let operation: BooleanOp | ComparisonOp | undefined;
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
