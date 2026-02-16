/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../Environment";
import { Variable } from "./Variable";

/** Represents a parameter that will be passed as a separate object
 * @group Variables
 */
export class Param<T = unknown> extends Variable {
    public value: T;

    constructor(value: T) {
        super();
        this.prefix = "param";
        this.value = value;
    }

    /** Defines if the Param has a value that needs to be returned by the builder */
    public get hasValue(): boolean {
        return this.value !== undefined;
    }

    public getCypher(env: CypherEnvironment): string {
        if (this.isNull) {
            return "NULL";
        }

        return `$${env.getReferenceId(this)}`;
    }

    public get isNull(): boolean {
        return this.value === null;
    }
}

/** Represents a parameter with a given name
 * @group Variables
 */
export class NamedParam extends Param {
    public id: string;

    constructor(name: string, value?: unknown) {
        super(value);
        this.id = name;
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        env.addNamedParamReference(this.id, this);
        return super.getCypher(env);
    }
}
