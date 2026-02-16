/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
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
    });
});
