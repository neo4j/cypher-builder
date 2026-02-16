/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../../Environment";
import type { PathVariable } from "../../references/Path";
import type { CypherCompilable } from "../../types";
import { padBlock } from "../../utils/pad-block";
import { PathAssign } from "../PathAssign";
import type { Pattern } from "../Pattern";
import type { QuantifiedPattern } from "./QuantifiedPattern";

/**
 * @group Patterns
 */
export class QuantifiedPath implements CypherCompilable {
    private readonly patterns: Array<QuantifiedPattern | Pattern> = [];

    constructor(...patterns: Array<QuantifiedPattern | Pattern>) {
        this.patterns = patterns;
    }

    public assignTo(variable: PathVariable): PathAssign<this> {
        return new PathAssign(this, variable);
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const patternsStrings = this.patterns.map((pattern) => {
            return pattern.getCypher(env);
        });

        const firstPattern = patternsStrings.shift() ?? "";

        if (patternsStrings.length > 0) {
            const remainingPatternsString = this.getRemainingPatternsString(patternsStrings);
            return `${firstPattern}\n${remainingPatternsString}`;
        }

        return firstPattern;
    }

    private getRemainingPatternsString(patternStrings: string[]): string {
        const remainingPatternsStr = patternStrings.join("\n");
        return padBlock(remainingPatternsStr, 6);
    }
}
