/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Expr } from "../index.js";
import type { CypherEnvironment } from "../Environment.js";
import { LabelExpr } from "../expressions/labels/label-expressions.js";
import { addLabelToken } from "../utils/add-label-token.js";
import { asArray } from "../utils/as-array.js";
import { escapeLabel, escapeType } from "../utils/escape.js";

export function labelsToString(
    labels: string | Array<string | Expr> | LabelExpr | Expr,
    env: CypherEnvironment
): string {
    const shouldEscape = !env.config.unsafeEscapeOptions.disableNodeLabelEscaping;
    return labelOrTypeToString(labels, env, shouldEscape, escapeLabel);
}

export function typeToString(type: string | LabelExpr | Expr, env: CypherEnvironment): string {
    const shouldEscape = !env.config.unsafeEscapeOptions.disableRelationshipTypeEscaping;
    return labelOrTypeToString(type, env, shouldEscape, escapeType);
}

function labelOrTypeToString(
    elements: string | Array<string | Expr> | LabelExpr | Expr,
    env: CypherEnvironment,
    shouldEscape: boolean,
    escapeFunc: (s: string) => string
): string {
    if (elements instanceof LabelExpr) {
        return addLabelToken(elements.getCypher(env));
    } else {
        const escapedLabels = asArray(elements).map((label: string | Expr) => {
            if (typeof label === "string") {
                return shouldEscape ? escapeFunc(label) : label;
            } else {
                return `$(${label.getCypher(env)})`;
            }
        });

        return addLabelToken(...escapedLabels);
    }
}
