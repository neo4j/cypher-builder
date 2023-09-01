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

import { CypherEnvironment } from "./Environment";
import { Param } from "./references/Param";
import { Variable } from "./references/Variable";

describe("Environment", () => {
    test("creates new environment", () => {
        const environment = new CypherEnvironment();

        expect(environment.getParams()).toEqual({});
    });

    test("creates new environment and adds param references", () => {
        const environment = new CypherEnvironment();

        const param = new Param("my-param");

        const paramId = environment.getReferenceId(param);

        expect(environment.getParams()).toEqual({
            [paramId]: "my-param",
        });
        expect(environment.getParamsSize()).toBe(1);
    });

    test("creates new environment and adds variables references", () => {
        const environment = new CypherEnvironment();

        const variable1 = new Variable();
        const variable2 = new Variable();

        const variable1Id = environment.getReferenceId(variable1);
        const variable2Id = environment.getReferenceId(variable2);

        expect(environment.getReferenceId(variable2)).toBe(variable2Id);
        expect(environment.getReferenceId(variable1)).toBe(variable1Id);
    });

    test("compile", () => {
        const param = new Param("Hello");
        const environment = new CypherEnvironment();

        const str = environment.compile(param);

        expect(environment.getParams()).toEqual({
            param0: "Hello",
        });
        expect(str).toEqual("$param0");
    });

    test("compile not compilable should throw", () => {
        const environment = new CypherEnvironment();
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            environment.compile({} as any);
        }).toThrowError("Can't compile. Passing a non Cypher Builder element to env.compile");
    });

    describe("prefix", () => {
        test("environment with a string prefix", () => {
            const environment = new CypherEnvironment("my-prefix");

            const variable = new Variable();
            const param = new Param("my-param");

            const paramId = environment.getReferenceId(param);
            const variableId = environment.getReferenceId(variable);

            expect(paramId).toBe("my-prefixparam0");
            expect(variableId).toBe("my-prefixvar0");
        });

        test("environment with an object prefix", () => {
            const environment = new CypherEnvironment({
                params: "p",
                variables: "v",
            });

            const variable = new Variable();
            const param = new Param("my-param");

            const paramId = environment.getReferenceId(param);
            const variableId = environment.getReferenceId(variable);

            expect(paramId).toBe("pparam0");
            expect(variableId).toBe("vvar0");
        });

        test("environment with an object prefix with default values", () => {
            const environment = new CypherEnvironment({});

            const variable = new Variable();
            const param = new Param("my-param");

            const paramId = environment.getReferenceId(param);
            const variableId = environment.getReferenceId(variable);

            expect(paramId).toBe("param0");
            expect(variableId).toBe("var0");
        });
    });
});
