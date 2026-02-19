/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { CypherEnvironment } from "../Environment.js";
import type { Variable } from "../references/Variable.js";
import type { CypherCompilable, Expr } from "../types.js";
import { padBlock } from "../utils/pad-block.js";
import { padLeft } from "../utils/pad-left.js";
import { stringifyObject } from "../utils/stringify-object.js";

const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");

export abstract class PatternElement implements CypherCompilable {
    protected variable: Variable | undefined;

    constructor(element: Variable | undefined) {
        this.variable = element;
    }

    public abstract getCypher(env: CypherEnvironment): string;

    protected serializeParameters(parameters: Record<string, Expr>, env: CypherEnvironment): string {
        if (Object.keys(parameters).length === 0) return "";
        const paramValues = Object.entries(parameters).reduce((acc: Record<string, string>, [key, param]) => {
            acc[key] = param.getCypher(env);
            return acc;
        }, {});

        return padLeft(stringifyObject(paramValues));
    }

    /** Custom string for browsers and templating
     * @hidden
     */
    public toString() {
        const cypher = padBlock(this.getCypher(new CypherEnvironment()));
        return `<${this.constructor.name}> """\n${cypher}\n"""`;
    }

    /** Custom log for console.log in Node
     * @hidden
     */
    [customInspectSymbol](): string {
        return this.toString();
    }
}
