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

const ESCAPE_SYMBOL_REGEX = /`/g;

/** Escapes a Node label string */
export function escapeLabel(label: string): string {
    return escapeIfNeeded(label);
}

/** Escapes a Relationship type string */
export function escapeType(type: string): string {
    return escapeIfNeeded(type);
}

/** Escapes a property name string */
export function escapeProperty(propName: string): string {
    return escapeIfNeeded(propName);
}

/** Escapes a variable name if needed */
export function escapeVariable(varName: string): string {
    return escapeIfNeeded(varName);
}

/** Escapes a literal string */
export function escapeLiteralString(str: string): string {
    return str.replaceAll(`"`, `\\"`);
}

function escapeIfNeeded(str: string): string {
    const normalizedStr = normalizeString(str);
    if (needsEscape(normalizedStr)) {
        const escapedLabel = normalizedStr.replace(ESCAPE_SYMBOL_REGEX, "``");
        return `\`${escapedLabel}\``;
    }
    return normalizedStr;
}

function normalizeString(str: string): string {
    return str.replace(/\\u0060/g, "`");
}

function needsEscape(str: string): boolean {
    if (!str) return false;
    const validStr = /^[a-z_][0-9a-z_]*$/i;
    return !validStr.test(str);
}
