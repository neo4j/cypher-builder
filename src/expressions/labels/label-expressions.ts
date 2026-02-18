/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../../Environment";
import type { CypherCompilable, Expr } from "../../types";
import { compileCypherIfExists } from "../../utils/compile-cypher-if-exists";
import { escapeLabel } from "../../utils/escape";

/** @inline */
type LabelSource = string | LabelExpr | Expr;

/** @group Patterns */
export type LabelOperator = "&" | "|" | "!" | "%";

/**
 * Label Expression to be used as part of a Pattern
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#label-expressions | Cypher Documentation}
 * @group Patterns
 */
export abstract class LabelExpr implements CypherCompilable {
    protected operator: LabelOperator;

    constructor(operator: LabelOperator) {
        this.operator = operator;
    }

    /**
     * @internal
     */
    public abstract getCypher(env: CypherEnvironment): string;

    protected compileLabel(expr: LabelSource, env: CypherEnvironment) {
        if (typeof expr === "string") {
            return escapeLabel(expr);
        } else if (expr instanceof LabelExpr) {
            return compileCypherIfExists(expr, env);
        } else {
            return `$(${compileCypherIfExists(expr, env)})`;
        }
    }
}

class BinaryLabelExpr extends LabelExpr {
    private readonly labels: Array<LabelSource>;

    constructor(operator: "&" | "|", labels: Array<LabelSource>) {
        super(operator);
        this.labels = labels;
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const labelStrs = this.labels.map((l) => this.compileLabel(l, env));
        if (labelStrs.length === 0) return "";

        return `(${labelStrs.join(this.operator)})`;
    }
}

class NotLabelExpr extends LabelExpr {
    private readonly label: LabelSource;

    constructor(label: LabelSource) {
        super("!");
        this.label = label;
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const labelStrs = this.compileLabel(this.label, env);

        return `${this.operator}${labelStrs}`;
    }
}

class WildcardLabelExpr extends LabelExpr {
    constructor() {
        super("%");
    }

    /**
     * @internal
     */
    public getCypher(): string {
        return this.operator;
    }
}

/** Generates an `&` operator between labels or types
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#label-expressions | Cypher Documentation}
 * @group Expressions
 * @category Operators
 */
function labelAnd(...labels: Array<LabelSource>): LabelExpr {
    return new BinaryLabelExpr("&", labels);
}

/** Generates an `|` operator between labels or types
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#label-expressions | Cypher Documentation}
 * @group Expressions
 * @category Operators
 */
function labelOr(...labels: Array<LabelSource>): LabelExpr {
    return new BinaryLabelExpr("|", labels);
}

/** Generates an `!` operator for a label or type
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#label-expressions | Cypher Documentation}
 * @group Expressions
 * @category Operators
 */
function labelNot(label: LabelSource): LabelExpr {
    return new NotLabelExpr(label);
}

/** Generates an wildcard (`%`) operator to substitute a label or type
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#label-expressions | Cypher Documentation}
 * @group Expressions
 * @category Operators
 */
const wildcard: LabelExpr = new WildcardLabelExpr();

export const labelExpr = {
    and: labelAnd,
    or: labelOr,
    not: labelNot,
    wildcard,
};
