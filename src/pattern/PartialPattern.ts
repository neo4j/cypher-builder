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
import type { RelationshipProperties } from "../references/RelationshipRef";
import { RelationshipRef } from "../references/RelationshipRef";
import type { Variable } from "../references/Variable";
import { compileCypherIfExists } from "../utils/compile-cypher-if-exists";
import type { NodePattern, RelationshipPattern } from "./Pattern";
import { Pattern } from "./Pattern";
import { PatternElement } from "./PatternElement";
import { labelsToString } from "./labels-to-string";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PartialPattern extends WithWhere {}

export type LengthOption =
    | number
    | "*"
    | { min: number; max?: number }
    | { min?: number; max: number }
    | { min: number; max: number };

/** Partial pattern, cannot be used until connected to a node
 * @group Patterns
 */

@mixin(WithWhere)
export class PartialPattern extends PatternElement {
    private length: LengthOption | undefined;
    private direction: "left" | "right" | "undirected";
    private previous: Pattern;
    private properties: RelationshipProperties | undefined;

    private type: string | LabelExpr | undefined;

    constructor(variable: Variable | undefined, options: RelationshipPattern, previous: Pattern) {
        super(variable);

        this.type = options.type;
        this.properties = options.properties;
        this.previous = previous;
        this.direction = options.direction ?? "right";
        this.length = options.length;
    }

    public to(node: Variable, options?: NodePattern): Pattern;
    public to(nodeConfig?: NodePattern): Pattern;
    public to(node?: Variable | NodePattern, options?: NodePattern): Pattern {
        if (!node) node = new NodeRef();
        return new Pattern(node, options, this);
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const prevStr = this.previous.getCypher(env);

        const typeStr = this.getTypeStr(env);
        const relStr = this.variable ? `${this.variable.getCypher(env)}` : "";

        const propertiesStr = this.properties ? this.serializeParameters(this.properties, env) : "";
        const whereStr = compileCypherIfExists(this.whereSubClause, env, { prefix: " " });
        const lengthStr = this.generateLengthStr();

        const leftArrow = this.direction === "left" ? "<-" : "-";
        const rightArrow = this.direction === "right" ? "->" : "-";

        return `${prevStr}${leftArrow}[${relStr}${typeStr}${lengthStr}${whereStr}${propertiesStr}]${rightArrow}`;
    }

    private generateLengthStr(): string {
        if (this.length === undefined) return "";
        if (typeof this.length === "number") {
            return `*${this.length}`;
        } else if (this.length === "*") {
            return "*";
        } else {
            return `*${this.length.min ?? ""}..${this.length.max ?? ""}`;
        }
    }

    private getTypeStr(env: CypherEnvironment): string {
        if (this.type) {
            return labelsToString(this.type, env);
        } else if (this.variable instanceof RelationshipRef) {
            return labelsToString(this.variable.type ?? [], env);
        }
        return "";
    }
}
