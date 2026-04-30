/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

/** These names must be escaped for variables */
const RESERVED_VAR_NAMES = new Set(["contains", "in", "where", "is"]);

/** Escapes a Node label string */
export function escapeLabel(label: string): string {
    return escapeIfNeeded(label);
}

/** Escapes a Relationship type string */
export function escapeType(type: string): string {
    // Use same logic as escape label
    return escapeLabel(type);
}

/** Escapes a property name string */
export function escapeProperty(propName: string): string {
    return escapeIfNeeded(propName);
}

/** Escapes a variable name if needed */
export function escapeVariable(varName: string): string {
    if (RESERVED_VAR_NAMES.has(varName.toLowerCase())) {
        return escapeString(varName);
    }
    return escapeIfNeeded(varName);
}

/** Escapes a literal string
 * Given a string, it adds the single quotes (') and escapes ('), (\) and the unicode versions
 */
export function escapeLiteral(str: string): string {
    const normalizedStr = str.replaceAll("\\u0027", "'").replaceAll("\\u005C", "\\");
    const escapedStr = normalizedStr.replaceAll("\\", "\\\\").replaceAll(`'`, `\\'`);
    return `'${escapedStr}'`;
}

function escapeIfNeeded(str: string): string {
    const normalizedStr = normalizeString(str);
    if (needsEscape(normalizedStr)) {
        return escapeString(normalizedStr);
    }
    return normalizedStr;
}

function escapeString(str: string): string {
    const normalizedStr = normalizeString(str);
    const escapedStr = normalizedStr.replaceAll("`", "``");
    return `\`${escapedStr}\``;
}

function normalizeString(str: string): string {
    return str.replaceAll("\\u0060", "`");
}

function needsEscape(str: string): boolean {
    if (!str) return false;
    const validStr = /^[a-z_][0-9a-z_]*$/i;
    return !validStr.test(str);
}
