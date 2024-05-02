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

import Cypher from "../../src/";
import { TestClause } from "../../src/utils/TestClause";

describe("Patterns", () => {
    describe("node", () => {
        test("Simple node", () => {
            const node = new Cypher.Node({ labels: ["TestLabel"] });

            const pattern = new Cypher.Pattern(node).withoutLabels();
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple node with default values", () => {
            const node = new Cypher.Node({ labels: ["TestLabel"] });

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel)"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Node with properties and labels", () => {
            const node = new Cypher.Node({ labels: ["TestLabel"] });

            const pattern = new Cypher.Pattern(node).withProperties({ name: new Cypher.Param("test") });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel { name: $param0 })"`);
            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "test",
                }
            `);
        });

        test("Node with properties using expressions and labels", () => {
            const node = new Cypher.Node({ labels: ["TestLabel"] });

            const pattern = new Cypher.Pattern(node).withProperties({
                name: Cypher.plus(new Cypher.Literal("The "), new Cypher.Literal("Matrix")),
            });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(
                `"(this0:TestLabel { name: (\\"The \\" + \\"Matrix\\") })"`
            );
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple node with label that needs normalize", () => {
            const node = new Cypher.Node({ labels: ["Test&Label"] });

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:\`Test&Label\`)"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Node with escaped parameters and labels", () => {
            const node = new Cypher.Node({ labels: ["TestLabel"] });

            const pattern = new Cypher.Pattern(node).withProperties({ $_name: new Cypher.Param("test") });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel { \`$_name\`: $param0 })"`);
            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "test",
                }
            `);
        });

        test("Node with empty properties and labels", () => {
            const node = new Cypher.Node({ labels: ["TestLabel"] });

            const pattern = new Cypher.Pattern(node).withProperties({});
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel)"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple node without variable", () => {
            const node = new Cypher.Node({ labels: ["TestLabel"] });

            const pattern = new Cypher.Pattern(node).withoutVariable();
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(:TestLabel)"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple node getVariables", () => {
            const node = new Cypher.Node({ labels: ["TestLabel"] });

            const pattern = new Cypher.Pattern(node).withoutLabels().withoutVariable();
            expect(pattern.getVariables()).toEqual([node]);
        });
    });

    describe("relationships", () => {
        test("Simple relationship Pattern", () => {
            const a = new Cypher.Node();
            const b = new Cypher.Node();
            const rel = new Cypher.Relationship({
                type: "ACTED_IN",
            });

            const query = new TestClause(new Cypher.Pattern(a).related(rel).to(b));
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple relationship Pattern without parameters", () => {
            const a = new Cypher.Node();

            const query = new TestClause(new Cypher.Pattern(a).related().to());
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple Pattern with properties", () => {
            const a = new Cypher.Node({
                labels: ["Person", "Actor"],
            });

            const aProperties = {
                name: new Cypher.Param("Arthur"),
                surname: new Cypher.Param("Dent"),
            };
            const b = new Cypher.Node();
            const rel = new Cypher.Relationship({
                type: "ACTED_IN",
            });

            const query = new TestClause(
                new Cypher.Pattern(a)
                    .withProperties(aProperties)
                    .related(rel)
                    .withProperties({ roles: new Cypher.Param(["neo"]) })
                    .to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(
                `"(this0:Person:Actor { name: $param0, surname: $param1 })-[this1:ACTED_IN { roles: $param2 }]->(this2)"`
            );

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "Arthur",
                  "param1": "Dent",
                  "param2": [
                    "neo",
                  ],
                }
            `);
        });

        test("Simple Pattern with expressions in properties", () => {
            const a = new Cypher.Node({
                labels: ["Person", "Actor"],
            });

            const b = new Cypher.Node();
            const rel = new Cypher.Relationship({
                type: "ACTED_IN",
            });

            const query = new TestClause(
                new Cypher.Pattern(a)
                    .related(rel)
                    .withProperties({
                        roles: Cypher.plus(new Cypher.Literal("The "), new Cypher.Literal("Matrix")),
                    })
                    .to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(
                `"(this0:Person:Actor)-[this1:ACTED_IN { roles: (\\"The \\" + \\"Matrix\\") }]->(this2)"`
            );

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Long relationship Pattern", () => {
            const a = new Cypher.Node();
            const b = new Cypher.Node();
            const c = new Cypher.Node({ labels: ["TestLabel"] });

            const rel1 = new Cypher.Relationship({
                type: "ACTED_IN",
            });
            const rel2 = new Cypher.Relationship({
                type: "ACTED_IN",
            });

            const query = new TestClause(new Cypher.Pattern(a).related(rel1).to(b).related(rel2).to(c));
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(
                `"(this0)-[this1:ACTED_IN]->(this2)-[this3:ACTED_IN]->(this4:TestLabel)"`
            );

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Long relationship Pattern getVariables", () => {
            const a = new Cypher.Node();
            const b = new Cypher.Node();
            const c = new Cypher.Node({ labels: ["TestLabel"] });

            const rel1 = new Cypher.Relationship({
                type: "ACTED_IN",
            });
            const rel2 = new Cypher.Relationship({
                type: "ACTED_IN",
            });

            const pattern = new Cypher.Pattern(a).related(rel1).to(b).related(rel2).to(c);
            expect(pattern.getVariables()).toEqual([a, rel1, b, rel2, c]);
        });

        test("Escape relationship type if needed", () => {
            const a = new Cypher.Node();
            const b = new Cypher.Node();
            const rel = new Cypher.Relationship({
                type: "ACTE`D_IN",
            });

            const query = new TestClause(new Cypher.Pattern(a).related(rel).to(b));
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:\`ACTE\`\`D_IN\`]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Relationship Pattern without type", () => {
            const a = new Cypher.Node();
            const rel = new Cypher.Relationship({ type: "REL" });

            const query = new TestClause(new Cypher.Pattern(a).related(rel).withoutType().to());
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Relationship Pattern with different directions", () => {
            const a = new Cypher.Node();
            const rel = new Cypher.Relationship({ type: "REL" });

            const leftPattern = new Cypher.Pattern(a).related(rel).withDirection("left").to();
            const rightPattern = new Cypher.Pattern(a).related(rel).withDirection("right").to();
            const undirectedPattern = new Cypher.Pattern(a).related(rel).withDirection("undirected").to();

            expect(new TestClause(leftPattern).build().cypher).toMatchInlineSnapshot(`"(this0)<-[this1:REL]-(this2)"`);
            expect(new TestClause(rightPattern).build().cypher).toMatchInlineSnapshot(`"(this0)-[this1:REL]->(this2)"`);
            expect(new TestClause(undirectedPattern).build().cypher).toMatchInlineSnapshot(
                `"(this0)-[this1:REL]-(this2)"`
            );
        });
    });

    describe("Variable length", () => {
        const a = new Cypher.Node();
        const b = new Cypher.Node();
        const actedInRelationship = new Cypher.Relationship({ type: "ACTED_IN" });

        test("variable length with exact value", () => {
            const query = new TestClause(new Cypher.Pattern(a).related(actedInRelationship).withLength(2).to(b));
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*2]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with *", () => {
            const query = new TestClause(new Cypher.Pattern(a).related(actedInRelationship).withLength("*").to(b));
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with max only", () => {
            const query = new TestClause(
                new Cypher.Pattern(a).related(actedInRelationship).withLength({ max: 2 }).to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*..2]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with min only", () => {
            const query = new TestClause(
                new Cypher.Pattern(a).related(actedInRelationship).withLength({ min: 2 }).to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*2..]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with min and max", () => {
            const query = new TestClause(
                new Cypher.Pattern(a).related(actedInRelationship).withLength({ min: 2, max: 4 }).to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*2..4]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with exact value and properties", () => {
            const query = new TestClause(
                new Cypher.Pattern(a)
                    .related(actedInRelationship)
                    .withProperties({
                        value: new Cypher.Param(100),
                    })
                    .withLength(2)
                    .to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(
                `"(this0)-[this1:ACTED_IN*2 { value: $param0 }]->(this2)"`
            );

            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": 100,
                }
            `);
        });

        test("variable length with empty relationship", () => {
            const query = new TestClause(new Cypher.Pattern(a).related().withoutVariable().withLength(2).to(b));
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[*2]->(this1)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with 0 exact", () => {
            const query = new TestClause(new Cypher.Pattern(a).related(actedInRelationship).withLength(0).to(b));
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*0]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with 0 min", () => {
            const query = new TestClause(
                new Cypher.Pattern(a).related(actedInRelationship).withLength({ min: 0 }).to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*0..]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with 0 max", () => {
            const query = new TestClause(
                new Cypher.Pattern(a).related(actedInRelationship).withLength({ max: 0 }).to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*..0]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("Where predicate", () => {
        it("Node pattern with where predicate", () => {
            const node = new Cypher.Node({ labels: ["TestLabel"] });

            const pattern = new Cypher.Pattern(node).where(
                Cypher.eq(node.property("name"), new Cypher.Literal("Keanu"))
            );
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel WHERE this0.name = \\"Keanu\\")"`);
        });

        it("Node pattern with where predicate and properties", () => {
            const node = new Cypher.Node({ labels: ["TestLabel"] });

            const pattern = new Cypher.Pattern(node)
                .where(Cypher.eq(node.property("name"), new Cypher.Literal("Keanu")))
                .withProperties({
                    released: new Cypher.Literal(1999),
                })
                .related()
                .to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(
                `"(this0:TestLabel { released: 1999 } WHERE this0.name = \\"Keanu\\")-[this1]->(this2)"`
            );
        });

        it("Node pattern with where predicate in target node", () => {
            const node = new Cypher.Node({ labels: ["TestLabel"] });

            const pattern = new Cypher.Pattern(node)
                .related()
                .to()
                .where(Cypher.eq(node.property("name"), new Cypher.Literal("Keanu")));
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(
                `"(this0:TestLabel)-[this1]->(this2 WHERE this0.name = \\"Keanu\\")"`
            );
        });

        it("Relationship pattern with where predicate", () => {
            const node = new Cypher.Node({ labels: ["TestLabel"] });
            const relationship = new Cypher.Relationship({ type: "ACTED_IN" });

            const pattern = new Cypher.Pattern(node)
                .related(relationship)
                .where(Cypher.eq(relationship.property("role"), new Cypher.Literal("Neo")))
                .to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(
                `"(this0:TestLabel)-[this1:ACTED_IN WHERE this1.role = \\"Neo\\"]->(this2)"`
            );
        });

        it("Relationship pattern with where predicate and properties", () => {
            const node = new Cypher.Node({ labels: ["TestLabel"] });
            const relationship = new Cypher.Relationship({ type: "ACTED_IN" });

            const pattern = new Cypher.Pattern(node)
                .related(relationship)
                .where(Cypher.eq(relationship.property("role"), new Cypher.Literal("Neo")))
                .withProperties({
                    test: new Cypher.Literal("hello"),
                })
                .to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(
                `"(this0:TestLabel)-[this1:ACTED_IN WHERE this1.role = \\"Neo\\" { test: \\"hello\\" }]->(this2)"`
            );
        });

        test("Empty Pattern", () => {
            const pattern = new Cypher.Pattern();
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });
});
