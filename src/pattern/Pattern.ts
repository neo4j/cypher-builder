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

import type { PathVariable } from "..";
import { CypherEnvironment } from "../Environment";
import { WithWhere } from "../clauses/mixins/sub-clauses/WithWhere";
import { mixin } from "../clauses/utils/mixin";
import type { LabelExpr } from "../expressions/labels/label-expressions";
import { RelationshipRef } from "../references/RelationshipRef";
import { Variable } from "../references/Variable";
import type { Expr } from "../types";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import { padBlock } from "../utils/pad-block";
import type { LengthOption } from "./PartialPattern";
import { PartialPattern } from "./PartialPattern";
import { PathAssign } from "./PathAssign";
import { PatternElement } from "./PatternElement";
import { labelsToString } from "./labels-to-string";
import { QuantifiedPattern, type Quantifier } from "./quantified-patterns/QuantifiedPattern";

export type NodePattern = {
    labels?: string | string[] | LabelExpr;
    properties?: Record<string, Expr>;
};

export type RelationshipPattern = {
    type?: string | LabelExpr;
    properties?: Record<string, Expr>;
    direction?: "left" | "right" | "undirected";
    length?: LengthOption;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Pattern extends WithWhere {}

/** Represents a pattern of a single node or n-relationships to be used in clauses.
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/patterns/)
 * @group Patterns
 */
@mixin(WithWhere)
export class Pattern extends PatternElement {
    private readonly properties: Record<string, Expr> | undefined;
    private readonly labels: string | string[] | LabelExpr | undefined;

    protected previous: PartialPattern | undefined;

    constructor(nodeConfig?: NodePattern);
    constructor(node: Variable, options?: NodePattern);
    constructor(nodeVariable: Variable | NodePattern | undefined, options: NodePattern = {}) {
        const firstArgumentIsVar = nodeVariable instanceof Variable;
        const variable = firstArgumentIsVar ? nodeVariable : undefined;
        super(variable);

        if (!firstArgumentIsVar) {
            options = nodeVariable ?? {};
        }

        this.labels = options.labels;
        this.properties = options.properties;
    }

    public related(ref?: Variable, options?: RelationshipPattern): PartialPattern;
    public related(ref: RelationshipPattern): PartialPattern;
    public related(ref?: Variable | RelationshipPattern, options?: RelationshipPattern): PartialPattern {
        if (ref instanceof Variable) {
            return new PartialPattern(ref, options ?? {}, this);
        } else {
            // Emulates previous behaviour
            let fakeRef: RelationshipRef | undefined;
            if (!ref && !options) {
                fakeRef = new RelationshipRef();
            }
            return new PartialPattern(fakeRef, options ?? ref ?? {}, this);
        }
    }

    /** Adds a quantifier to the pattern such as `{1,3}`, to be used as part of a {@link QuantifiedPath} */
    public quantifier(quantifier: Quantifier): QuantifiedPattern {
        return new QuantifiedPattern(this, quantifier);
    }

    public assignTo(variable: PathVariable): PathAssign<this> {
        return new PathAssign(this, variable);
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const prevStr = this.previous?.getCypher(env) ?? "";

        const nodeRefId = this.variable ? `${this.variable.getCypher(env)}` : "";

        const propertiesStr = this.properties ? this.serializeParameters(this.properties, env) : "";
        const nodeLabelStr = this.getLabelsStr(env);

        const whereStr = compileCypherIfExists(this.whereSubClause, env, { prefix: " " });

        return `${prevStr}(${nodeRefId}${nodeLabelStr}${propertiesStr}${whereStr})`;
    }

    private getLabelsStr(env: CypherEnvironment): string {
        if (this.labels) {
            return labelsToString(this.labels, env);
        }
        return "";
    }
}

// This exists to support a "previous" parameter without exposing this to the user
export class NestedPattern extends Pattern {
    constructor(nodeVariable?: Variable | NodePattern, options: NodePattern = {}, previous?: PartialPattern) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
        super(nodeVariable as any, options);
        this.previous = previous;
    }

    /** Overrides custom string to `Pattern` instead of `NestedPattern`
     * @hidden
     */
    public toString() {
        const cypher = padBlock(this.getCypher(new CypherEnvironment()));
        return `<Pattern> """\n${cypher}\n"""`;
    }
}
