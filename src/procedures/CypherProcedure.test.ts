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

import Cypher from "..";

describe("Procedures", () => {
    test("Custom Procedure without yield", () => {
        const targetNode = new Cypher.Node({ labels: ["Movie"] });
        const customProcedure = new Cypher.Procedure("customProcedure", [targetNode]);

        const { cypher, params } = customProcedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL customProcedure(this0)"`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Custom Procedure with yield", () => {
        const targetNode = new Cypher.Node({ labels: ["Movie"] });
        const customProcedure = new Cypher.Procedure("customProcedure", [targetNode]).yield("result1", "result2");

        const { cypher, params } = customProcedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL customProcedure(this0) YIELD result1, result2"`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Custom Procedure with * yield", () => {
        const targetNode = new Cypher.Node({ labels: ["Movie"] });
        const customProcedure = new Cypher.Procedure("customProcedure", [targetNode]).yield("*");

        const { cypher, params } = customProcedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL customProcedure(this0) YIELD *"`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Custom Procedure with yield and alias", () => {
        const targetNode = new Cypher.Node({ labels: ["Movie"] });
        const customProcedure = new Cypher.Procedure("customProcedure", [targetNode]).yield(
            "result1",
            ["result2", new Cypher.Literal("aliased")],
            ["result3", "string-alias"]
        );

        const { cypher, params } = customProcedure.build();

        expect(cypher).toMatchInlineSnapshot(
            `"CALL customProcedure(this0) YIELD result1, result2 AS \\"aliased\\", result3 AS string-alias"`
        );
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Custom Procedure with explicit yield", () => {
        const targetNode = new Cypher.Node({ labels: ["Movie"] });
        const customProcedure = new Cypher.Procedure<"result1" | "result2">("customProcedure", [targetNode]).yield(
            "result1",
            "result2"
        );

        const { cypher, params } = customProcedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL customProcedure(this0) YIELD result1, result2"`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Custom VoidProcedure without yield", () => {
        const targetNode = new Cypher.Node({ labels: ["Movie"] });
        const customProcedure = new Cypher.VoidProcedure("customProcedure", [targetNode]);

        const { cypher, params } = customProcedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL customProcedure(this0)"`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Custom Procedure with chained yield", () => {
        const customProcedure = new Cypher.Procedure<"result1" | "result2">("customProcedure")
            .yield("result1")
            .yield(["result2", "aliased"]);

        const { cypher, params } = customProcedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL customProcedure() YIELD result1, result2 AS aliased"`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });
});
