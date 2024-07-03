import type { CypherEnvironment } from "../../Environment";
import type { CypherCompilable } from "../../types";
import { padBlock } from "../../utils/pad-block";
import type { Pattern } from "../Pattern";
import type { QuantifiedPattern } from "./QuantifiedPattern";

export class QuantifiedPath implements CypherCompilable {
    private patterns: Array<QuantifiedPattern | Pattern> = [];

    constructor(...patterns: Array<QuantifiedPattern | Pattern>) {
        this.patterns = patterns;
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
        // const newLineStr = patternsStrings.length > 0 ? "\n" : "";

        // const remainingPatternsStr = patternsStrings.join("\n");

        // return `${firstPattern}${newLineStr}${padBlock(remainingPatternsStr, 6)}`;
    }

    private getRemainingPatternsString(patternStrings: string[]): string {
        const remainingPatternsStr = patternStrings.join("\n");
        return padBlock(remainingPatternsStr, 6);
    }
}
