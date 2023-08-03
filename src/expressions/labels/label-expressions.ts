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

import type { Environment } from "../..";
import type { CypherCompilable } from "../../types";
import { compileCypherIfExists } from "../../utils/compile-cypher-if-exists";
import { escapeLabel } from "../../utils/escape";

export type LabelOperator = "&" | "|" | "!" | "%";

type Label = string | LabelExpr;

/**
 * Label Expression
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#label-expressions)
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
    public abstract getCypher(env: Environment): string;

    protected compileLabel(expr: Label, env: Environment) {
        if (typeof expr === "string") {
            return escapeLabel(expr);
        }
        return compileCypherIfExists(expr, env);
    }
}

class BinaryLabelExpr extends LabelExpr {
    private labels: Label[];

    constructor(operator: "&" | "|", labels: Label[]) {
        super(operator);
        this.labels = labels;
    }

    /**
     * @internal
     */
    public getCypher(env: Environment): string {
        const labelStrs = this.labels.map((l) => this.compileLabel(l, env));
        if (labelStrs.length === 0) return "";

        return `(${labelStrs.join(this.operator)})`;
    }
}

class NotLabelExpr extends LabelExpr {
    private label: Label;

    constructor(label: Label) {
        super("!");
        this.label = label;
    }

    /**
     * @internal
     */
    public getCypher(env: Environment): string {
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
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#label-expressions)
 * @group Expressions
 * @category Operators
 */
function labelAnd(...labels: Label[]): LabelExpr {
    return new BinaryLabelExpr("&", labels);
}

/** Generates an `|` operator between labels or types
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#label-expressions)
 * @group Expressions
 * @category Operators
 */
function labelOr(...labels: Label[]): LabelExpr {
    return new BinaryLabelExpr("|", labels);
}

/** Generates an `!` operator for a label or type
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#label-expressions)
 * @group Expressions
 * @category Operators
 */
function labelNot(label: Label): LabelExpr {
    return new NotLabelExpr(label);
}

/** Generates an wildcard (`%`) operator to substitute a label or type
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/expressions/#label-expressions)
 * @group Expressions
 * @category Operators
 */
const wildcard = new WildcardLabelExpr();

export const labelExpr = {
    and: labelAnd,
    or: labelOr,
    not: labelNot,
    wildcard,
};
