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

import type { Expr } from "..";
import type { CypherEnvironment } from "../Environment";
import { LabelExpr } from "../expressions/labels/label-expressions";
import { addLabelToken } from "../utils/add-label-token";
import { asArray } from "../utils/as-array";
import { escapeLabel, escapeType } from "../utils/escape";

export function labelsToString(
    labels: string | Array<string | Expr> | LabelExpr | Expr,
    env: CypherEnvironment
): string {
    if (labels instanceof LabelExpr) {
        return addLabelToken(env.config.labelOperator, labels.getCypher(env));
    } else {
        const shouldEscape = !env.config.unsafeEscapeOptions.disableNodeLabelEscaping;

        const escapedLabels = asArray(labels).map((label: string | Expr) => {
            if (typeof label === "string") {
                return shouldEscape ? escapeLabel(label) : label;
            } else {
                return `$(${label.getCypher(env)})`;
            }
        });

        return addLabelToken(env.config.labelOperator, ...escapedLabels);
    }
}

export function typeToString(type: string | LabelExpr, env: CypherEnvironment): string {
    if (type instanceof LabelExpr) {
        return addLabelToken(env.config.labelOperator, type.getCypher(env));
    } else {
        const shouldEscape = !env.config.unsafeEscapeOptions.disableRelationshipTypeEscaping;
        const escapedType = shouldEscape ? escapeType(type) : type;

        return addLabelToken(env.config.labelOperator, escapedType);
    }
}
