/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

export function padBlock(block: string, spaces = 4): string {
    const paddingStr = " ".repeat(spaces);
    const paddedNewLines = block.replaceAll("\n", `\n${paddingStr}`);
    return `${paddingStr}${paddedNewLines}`;
}
