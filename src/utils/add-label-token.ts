/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

/** Generates a string with all the labels. For example `:Movie&Film` */
export function addLabelToken(...labels: string[]): string {
    const firstLabel = labels.shift();
    if (!firstLabel) return "";

    const extraLabels = labels.map((label) => `&${label}`).join("");

    return `:${firstLabel}${extraLabels}`;
}
