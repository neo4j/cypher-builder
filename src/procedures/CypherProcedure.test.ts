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
        const targetNode = new Cypher.Node();
        const customProcedure = new Cypher.Procedure("customProcedure", [targetNode]);

        const { cypher, params } = customProcedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL customProcedure(this0)"`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Custom Procedure with yield", () => {
        const targetNode = new Cypher.Node();
        const customProcedure = new Cypher.Procedure("customProcedure", [targetNode]).yield("result1", "result2");

        const { cypher, params } = customProcedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL customProcedure(this0) YIELD result1, result2"`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Custom Procedure with * yield", () => {
        const targetNode = new Cypher.Node();
        const customProcedure = new Cypher.Procedure("customProcedure", [targetNode]).yield("*");

        const { cypher, params } = customProcedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL customProcedure(this0) YIELD *"`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Custom Procedure with yield and alias", () => {
        const targetNode = new Cypher.Node();
        const customProcedure = new Cypher.Procedure("customProcedure", [targetNode]).yield(
            "result1",
            ["result2", new Cypher.Literal("aliased")],
            ["result3", "string-alias"]
        );

        const { cypher, params } = customProcedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL customProcedure(this0) YIELD result1, result2 AS 'aliased', result3 AS string-alias"`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Custom Procedure with explicit yield", () => {
        const targetNode = new Cypher.Node();
        const customProcedure = new Cypher.Procedure<"result1" | "result2">("customProcedure", [targetNode]).yield(
            "result1",
            "result2"
        );

        const { cypher, params } = customProcedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL customProcedure(this0) YIELD result1, result2"`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Custom VoidProcedure without yield", () => {
        const targetNode = new Cypher.Node();
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

    describe("Optional", () => {
        test("Procedure with optional", () => {
            const targetNode = new Cypher.Node();
            const customProcedure = new Cypher.Procedure("customProcedure", [targetNode]).optional();

            const { cypher, params } = customProcedure.build();

            expect(cypher).toMatchInlineSnapshot(`"OPTIONAL CALL customProcedure(this0)"`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });
        test("VoidProcedure with optional", () => {
            const targetNode = new Cypher.Node();
            const customProcedure = new Cypher.VoidProcedure("customProcedure", [targetNode]).optional();

            const { cypher, params } = customProcedure.build();

            expect(cypher).toMatchInlineSnapshot(`"OPTIONAL CALL customProcedure(this0)"`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });

        test("Optional procedure with yield with optional", () => {
            const targetNode = new Cypher.Node();
            const customProcedure = new Cypher.Procedure<"test">("customProcedure", [targetNode])
                .optional()
                .yield("test");

            const { cypher, params } = customProcedure.build();

            expect(cypher).toMatchInlineSnapshot(`"OPTIONAL CALL customProcedure(this0) YIELD test"`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("Procedure with Yield and nested clauses", () => {
        test("Procedure with Where", () => {
            const procedure = new Cypher.Procedure("custom-procedure").yield("test");

            procedure.where(Cypher.true).and(Cypher.false).return("*");
            const { cypher, params } = procedure.build();

            expect(cypher).toMatchInlineSnapshot(`
"CALL custom-procedure() YIELD test
WHERE (true AND false)
RETURN *"
`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });

        test("Procedure with Delete", () => {
            const procedure = new Cypher.Procedure("custom-procedure").yield("test");

            procedure.delete(new Cypher.Node());
            const { cypher, params } = procedure.build();

            expect(cypher).toMatchInlineSnapshot(`
"CALL custom-procedure() YIELD test
DELETE this0"
`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });

        test("Procedure with Detach Delete", () => {
            const procedure = new Cypher.Procedure("custom-procedure").yield("test");

            procedure.detachDelete(new Cypher.Node());
            const { cypher, params } = procedure.build();

            expect(cypher).toMatchInlineSnapshot(`
"CALL custom-procedure() YIELD test
DETACH DELETE this0"
`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });

        test("Procedure with Remove", () => {
            const procedure = new Cypher.Procedure("custom-procedure").yield("test");

            procedure.remove(new Cypher.Node().property("test"));
            const { cypher, params } = procedure.build();

            expect(cypher).toMatchInlineSnapshot(`
"CALL custom-procedure() YIELD test
REMOVE this0.test"
`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });

        test("Procedure with Set", () => {
            const procedure = new Cypher.Procedure("custom-procedure").yield("test");

            procedure.set([new Cypher.Variable().property("test"), new Cypher.Literal("hello")]);
            const { cypher, params } = procedure.build();

            expect(cypher).toMatchInlineSnapshot(`
"CALL custom-procedure() YIELD test
SET var0.test = 'hello'"
`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });

        test("Procedure with Unwind", () => {
            const yieldVar = new Cypher.Variable();
            const procedure = new Cypher.Procedure("custom-procedure").yield(["test", yieldVar]);

            procedure.unwind([yieldVar, new Cypher.Variable()]);
            const { cypher, params } = procedure.build();

            expect(cypher).toMatchInlineSnapshot(`
"CALL custom-procedure() YIELD test AS var0
UNWIND var0 AS var1"
`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });

        test("Procedure with Merge", () => {
            const procedure = new Cypher.Procedure("custom-procedure").yield("test");

            procedure.merge(new Cypher.Pattern(new Cypher.Node()));
            const { cypher, params } = procedure.build();

            expect(cypher).toMatchInlineSnapshot(`
"CALL custom-procedure() YIELD test
MERGE (this0)    "
`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });

        test("Procedure with Create", () => {
            const procedure = new Cypher.Procedure("custom-procedure").yield("test");

            procedure.create(new Cypher.Pattern(new Cypher.Node()));
            const { cypher, params } = procedure.build();

            expect(cypher).toMatchInlineSnapshot(`
"CALL custom-procedure() YIELD test
CREATE (this0)"
`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });

        test("Procedure with Order by", () => {
            const testVar = new Cypher.NamedVariable("test");
            const procedure = new Cypher.Procedure("custom-procedure").yield("test").orderBy(testVar).skip(1).limit(10);

            procedure.create(new Cypher.Pattern(new Cypher.Node()));
            const { cypher, params } = procedure.build();

            expect(cypher).toMatchInlineSnapshot(`
"CALL custom-procedure() YIELD test
ORDER BY test ASC
SKIP 1
LIMIT 10
CREATE (this0)"
`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });
    });
});
