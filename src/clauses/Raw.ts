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

import type { CypherEnvironment } from "../Environment";
import type { CypherCompilable } from "../types";
import { isCypherCompilable } from "../utils/is-cypher-compilable";
import { toCypherParams } from "../utils/to-cypher-params";
import { Clause } from "./Clause";

type RawCypherCallback = (context: RawCypherContext) => [string, Record<string, unknown>] | string | undefined;

/** Allows for a raw string to be used as a clause
 * @group Utils
 */
export class Raw extends Clause {
    private readonly callback: RawCypherCallback;

    constructor(
        callback: ((context: RawCypherContext) => [string, Record<string, unknown>] | string | undefined) | string
    ) {
        super();
        if (typeof callback === "string") {
            this.callback = this.stringToCallback(callback);
        } else this.callback = callback;
    }

    public getCypher(env: CypherEnvironment): string {
        const cbResult = this.callback(new RawCypherContext(env));
        if (!cbResult) return "";
        let query: string;
        let params = {};
        if (typeof cbResult === "string") query = cbResult;
        else {
            [query, params] = cbResult;
        }

        const cypherParams = toCypherParams(params);
        env.addExtraParams(cypherParams);

        return query;
    }

    private stringToCallback(str: string): RawCypherCallback {
        return () => str;
    }
}

/**
 * @group Utils
 */
export class RawCypherContext {
    private readonly env: CypherEnvironment;

    /** @internal */
    constructor(env: CypherEnvironment) {
        this.env = env;
    }

    /** Compiles a Cypher element in the current context */
    public compile(element: CypherCompilable): string {
        if (!isCypherCompilable(element))
            throw new Error("Can't build. Passing a non Cypher Builder element to context.compile in RawCypher");

        return element.getCypher(this.env);
    }
}
