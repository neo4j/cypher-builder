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

import type { BuildConfig } from "./Cypher";
import { Param } from "./references/Param";
import type { NamedReference, Variable } from "./references/Variable";

export type EnvPrefix = {
    params?: string;
    variables?: string;
};

export type EnvConfig = {
    unsafeEscapeOptions: NonNullable<BuildConfig["unsafeEscapeOptions"]>;
    cypherVersion: BuildConfig["cypherVersion"];
};

const defaultConfig: EnvConfig = {
    unsafeEscapeOptions: {},
    cypherVersion: undefined,
};

/** Hold the internal references of Cypher parameters and variables
 * @group Internal
 */
export class CypherEnvironment {
    private readonly globalPrefix: string;

    private readonly references: Map<Variable, string> = new Map();
    private readonly params: Param[] = [];

    public readonly config: EnvConfig;

    /**
     *  @internal
     */
    constructor(prefix?: string, config: Partial<EnvConfig> = {}) {
        this.globalPrefix = prefix ?? "";

        this.config = {
            ...defaultConfig,
            ...config,
        };
    }

    public getReferenceId(reference: Variable): string {
        if (this.isNamedReference(reference)) return reference.id; // Overrides ids for compatibility reasons
        const id = this.references.get(reference);
        if (!id) {
            return this.addVariableReference(reference);
        }
        return id;
    }

    public getParams(): Record<string, unknown> {
        return this.params.reduce<Record<string, unknown>>((acc, param: Param) => {
            const key = this.getReferenceId(param);
            if (param.hasValue) {
                acc[key] = param.value;
            }
            return acc;
        }, {});
    }

    public addExtraParams(params: Record<string, Param>): void {
        Object.entries(params).forEach(([key, param]) => {
            this.addNamedParamReference(key, param);
        });
    }

    public addNamedParamReference(name: string, param: Param): void {
        if (!this.references.has(param)) {
            this.addParam(name, param);
        }
    }

    public getParamsSize(): number {
        return this.params.length;
    }

    private addParam(id: string, param: Param): string {
        const paramId = id;
        this.references.set(param, paramId);
        this.params.push(param);
        return paramId;
    }

    private addVariableReference(variable: Variable): string {
        const paramIndex = this.getParamsSize(); // Indexes are separate for readability reasons

        if (variable instanceof Param) {
            const varId = `${this.globalPrefix}${variable.prefix}${paramIndex}`;
            return this.addParam(varId, variable);
        }

        const varIndex = this.references.size - paramIndex;
        const varId = `${this.globalPrefix}${variable.prefix}${varIndex}`;
        this.references.set(variable, varId);
        return varId;
    }

    private isNamedReference(ref: Variable): ref is NamedReference {
        return "id" in ref;
    }
}
