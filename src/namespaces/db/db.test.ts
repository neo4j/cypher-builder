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

import Cypher from "../../index";
import { TestClause } from "../../utils/TestClause";

describe("db procedures", () => {
    test("db.awaitIndex", () => {
        const procedure = Cypher.db.awaitIndex("name", 123);

        const { cypher } = procedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL db.awaitIndex(\\"name\\", 123)"`);
    });
    test("db.awaitIndexes", () => {
        const procedure = Cypher.db.awaitIndexes(123);

        const { cypher } = procedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL db.awaitIndex(123)"`);
    });

    test.each(["createLabel", "createProperty", "createRelationshipType"] as const)(
        "%s with string parameter",
        (procedureName) => {
            const procedure = Cypher.db[procedureName]("param");

            const { cypher } = procedure.build();

            expect(cypher).toEqual(`CALL db.${procedureName}("param")`);
        }
    );

    test.each(["createLabel", "createProperty", "createRelationshipType"] as const)(
        "%s with Expr parameter",
        (procedureName) => {
            const procedure = Cypher.db[procedureName](new Cypher.Literal("param"));

            const { cypher } = procedure.build();

            expect(cypher).toEqual(`CALL db.${procedureName}("param")`);
        }
    );

    test("db.info", () => {
        const dbInfo = Cypher.db.info().yield("id", "creationDate");

        const { cypher } = dbInfo.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL db.info() YIELD id, creationDate"`);
    });

    describe("db.labels", () => {
        test("db.labels without yield", () => {
            const dbLabels = Cypher.db.labels();
            const { cypher, params } = dbLabels.build();

            expect(cypher).toMatchInlineSnapshot(`"CALL db.labels()"`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });

        test("db.labels with yield *", () => {
            const dbLabels = Cypher.db.labels().yield("*");
            const { cypher, params } = dbLabels.build();

            expect(cypher).toMatchInlineSnapshot(`"CALL db.labels() YIELD *"`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });

        test("db.labels with yield", () => {
            const dbLabels = Cypher.db.labels().yield("label");
            const { cypher, params } = dbLabels.build();

            expect(cypher).toMatchInlineSnapshot(`"CALL db.labels() YIELD label"`);
            expect(params).toMatchInlineSnapshot(`{}`);
        });

        test("db.labels with yield fails if projection is empty", () => {
            expect(() => {
                Cypher.db.labels().yield();
            }).toThrow("Empty projection in CALL ... YIELD");
        });
    });

    test("db.ping", () => {
        const procedure = Cypher.db.ping().yield("success");
        const { cypher } = procedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL db.ping() YIELD success"`);
    });

    test("db.propertyKeys", () => {
        const procedure = Cypher.db.propertyKeys().yield("propertyKey");
        const { cypher } = procedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL db.propertyKeys() YIELD propertyKey"`);
    });

    test("db.relationshipTypes", () => {
        const procedure = Cypher.db.relationshipTypes().yield("relationshipType");
        const { cypher } = procedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL db.relationshipTypes() YIELD relationshipType"`);
    });

    test("db.resampleIndex", () => {
        const procedure = Cypher.db.resampleIndex().yield("indexName");
        const { cypher } = procedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL db.resampleIndex() YIELD indexName"`);
    });

    test("db.resampleOutdatedIndexes", () => {
        const procedure = Cypher.db.resampleOutdatedIndexes();
        const { cypher } = procedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL db.resampleOutdatedIndexes()"`);
    });
});

describe("db functions", () => {
    test("db.nameFromElementId with string", () => {
        const dbNameFromElementId = Cypher.db.nameFromElementId("1234");
        const { cypher, params } = new TestClause(dbNameFromElementId).build();

        expect(cypher).toMatchInlineSnapshot(`"db.nameFromElementId(\\"1234\\")"`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("db.nameFromElementId with variable", () => {
        const varId = new Cypher.Variable();
        const dbNameFromElementId = Cypher.db.nameFromElementId(varId);

        const { cypher, params } = new TestClause(dbNameFromElementId).build();

        expect(cypher).toMatchInlineSnapshot(`"db.nameFromElementId(var0)"`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });
});
