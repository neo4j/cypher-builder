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

import type { CypherEnvironment } from "../Environment";
import { WithWhere } from "../clauses/mixins/sub-clauses/WithWhere";
import { mixin } from "../clauses/utils/mixin";
import type { LabelExpr } from "../expressions/labels/label-expressions";
import { NodeRef } from "../references/NodeRef";
import type { PathVariable } from "../references/Path";
import { RelationshipRef } from "../references/RelationshipRef";
import { Variable } from "../references/Variable";
import type { Expr } from "../types";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
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
    private withLabels = true;
    private withVariable = true;
    private readonly previous: PartialPattern | undefined;
    private properties: Record<string, Expr> | undefined;

    private readonly labels: string | string[] | LabelExpr | undefined;

    constructor(node: Variable, options?: NodePattern);
    constructor(nodeConfig: NodePattern);
    /** @internal */
    constructor(nodeVariable?: Variable | NodePattern, options?: NodePattern, previous?: PartialPattern);
    constructor(nodeVariable?: Variable | NodePattern, options: NodePattern = {}, previous?: PartialPattern) {
        const firstArgumentIsVar = nodeVariable instanceof Variable;
        let node = firstArgumentIsVar ? nodeVariable : undefined;
        if (!node) {
            node = new NodeRef();
        }
        super(node);

        // Emulates not having a variable if the config option is passed without one
        if (!firstArgumentIsVar && Boolean(nodeVariable)) {
            this.withVariable = false;
        }

        this.previous = previous;

        if (!firstArgumentIsVar) {
            options = nodeVariable ?? {};
        }

        this.labels = options.labels;
        this.properties = options.properties;
    }

    /** @deprecated */
    public withoutLabels(): this {
        this.withLabels = false;
        return this;
    }

    /** @deprecated */
    public withoutVariable(): this {
        this.withVariable = false;
        return this;
    }

    /** @deprecated Use `properties` field when creating the Pattern: `new Cypher.Pattern({ variable: node, properties: myProperties })` */
    public withProperties(properties: Record<string, Expr>): this {
        this.properties = properties;
        return this;
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

    /** @deprecated This method won't be available in future versions as variables will not be autogenerated by Patterns anymore. */
    public getVariables(): Variable[] {
        const prevVars = this.previous?.getVariables() ?? [];

        prevVars.push(this.element);
        return prevVars;
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const prevStr = this.previous?.getCypher(env) ?? "";

        const nodeRefId = this.withVariable ? `${this.element.getCypher(env)}` : "";

        const propertiesStr = this.properties ? this.serializeParameters(this.properties, env) : "";
        const nodeLabelStr = this.getLabelsStr(env);

        const whereStr = compileCypherIfExists(this.whereSubClause, env, { prefix: " " });

        return `${prevStr}(${nodeRefId}${nodeLabelStr}${propertiesStr}${whereStr})`;
    }

    private getLabelsStr(env: CypherEnvironment): string {
        if (!this.withLabels) {
            return "";
        }
        if (this.labels) {
            return labelsToString(this.labels, env);
        } else if (this.element instanceof NodeRef) {
            return labelsToString(this.element.labels, env);
        }
        return "";
    }
}
