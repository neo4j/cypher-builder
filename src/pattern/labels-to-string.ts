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
import { LabelExpr } from "../expressions/labels/label-expressions";
import { addLabelToken } from "../utils/add-label-token";
import { asArray } from "../utils/as-array";
import { escapeLabel } from "../utils/escape";

export function labelsToString(labels: string | string[] | LabelExpr, env: CypherEnvironment): string {
    if (labels instanceof LabelExpr) {
        const labelsStr = labels.getCypher(env);
        if (!labelsStr) {
            return "";
        }
        return addLabelToken(env.config.labelOperator, labels.getCypher(env));
    } else {
        const escapedLabels = asArray(labels).map(escapeLabel);
        if (escapedLabels.length === 0) {
            return "";
        }
        return addLabelToken(env.config.labelOperator, ...escapedLabels);
    }
}
