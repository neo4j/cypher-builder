import type { CypherEnvironment } from "../../Environment";
import type { CypherCompilable } from "../../types";
import type { Pattern } from "../Pattern";

export type Quantifier =
    | number
    | "*"
    | "+"
    | {
          min?: number;
          max?: number;
      };

/** Represents a quantified path pattern as a {@link Pattern} with at least one relationship and a quantifier of the form {1,2}
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/patterns/variable-length-patterns/#quantified-path-patterns)
 * @group Patterns
 */
export class QuantifiedPattern implements CypherCompilable {
    private pattern: Pattern;
    private quantifier: Quantifier;

    constructor(pattern: Pattern, quantifier: Quantifier) {
        this.pattern = pattern;
        this.quantifier = quantifier;
    }

    /**
     * @internal
     */
    public getCypher(env: CypherEnvironment): string {
        const patternStr = this.pattern.getCypher(env);
        const quantifierStr = this.generateQuantifierStr();

        return `(${patternStr})${quantifierStr}`;
    }

    private generateQuantifierStr(): string {
        if (typeof this.quantifier === "number") {
            return `{${this.quantifier}}`;
        } else if (typeof this.quantifier === "string") {
            return this.quantifier;
        } else {
            return `{${this.quantifier.min ?? ""},${this.quantifier.max ?? ""}}`;
        }
    }
}
