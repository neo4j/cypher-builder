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
import { TestClause } from "../utils/TestClause";

describe("Patterns", () => {
    describe("node", () => {
        test("Simple node", () => {
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple node with a variable", () => {
            const node = new Cypher.Variable();

            const pattern = new Cypher.Pattern(node);
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(var0)"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple node with default values", () => {
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: ["TestLabel"] });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel)"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Node with properties and labels", () => {
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, {
                labels: ["TestLabel"],
                properties: { name: new Cypher.Param("test") },
            });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel { name: $param0 })"`);
            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "test",
                }
            `);
        });

        test("Node with properties using expressions and labels", () => {
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, {
                labels: ["TestLabel"],
                properties: {
                    name: Cypher.plus(new Cypher.Literal("The "), new Cypher.Literal("Matrix")),
                },
            });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel { name: ('The ' + 'Matrix') })"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple node with label that needs normalization", () => {
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: ["Test&Label"] });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:\`Test&Label\`)"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple variable and label that needs normalization", () => {
            const node = new Cypher.Variable();

            const pattern = new Cypher.Pattern(node, { labels: ["Test&Label"] });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(var0:\`Test&Label\`)"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Node with escaped parameters and labels", () => {
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, {
                labels: ["TestLabel"],
                properties: { $_name: new Cypher.Param("test") },
            });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel { \`$_name\`: $param0 })"`);
            expect(queryResult.params).toMatchInlineSnapshot(`
                {
                  "param0": "test",
                }
            `);
        });

        test("Node with empty properties and labels", () => {
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: ["TestLabel"], properties: {} });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel)"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple node without variable", () => {
            const pattern = new Cypher.Pattern({ labels: ["TestLabel"] });
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(:TestLabel)"`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("relationships", () => {
        test("Simple relationship Pattern", () => {
            const a = new Cypher.Node();
            const b = new Cypher.Node();
            const rel = new Cypher.Relationship();

            const query = new TestClause(new Cypher.Pattern(a).related(rel, { type: "ACTED_IN" }).to(b));
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple relationship Pattern with variables", () => {
            const a = new Cypher.Variable();
            const b = new Cypher.Variable();
            const rel = new Cypher.Variable();

            const query = new TestClause(new Cypher.Pattern(a).related(rel).to(b));
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(var0)-[var1]->(var2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple relationship Pattern without parameters", () => {
            const a = new Cypher.Node();

            const query = new TestClause(new Cypher.Pattern(a).related({}).to({}));
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[]->()"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple relationship Pattern without variables", () => {
            const query = new TestClause(new Cypher.Pattern().related().to());
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"()-[]->()"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Simple Pattern with properties", () => {
            const a = new Cypher.Node();

            const aProperties = {
                name: new Cypher.Param("Arthur"),
                surname: new Cypher.Param("Dent"),
            };
            const b = new Cypher.Node();
            const rel = new Cypher.Relationship();

            const query = new TestClause(
                new Cypher.Pattern(a, { properties: aProperties, labels: ["Person", "Actor"] })
                    .related(rel, { type: "ACTED_IN", properties: { roles: new Cypher.Param(["neo"]) } })
                    .to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(
                `"(this0:Person&Actor { name: $param0, surname: $param1 })-[this1:ACTED_IN { roles: $param2 }]->(this2)"`
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
            const a = new Cypher.Node();

            const b = new Cypher.Node();
            const rel = new Cypher.Relationship();

            const query = new TestClause(
                new Cypher.Pattern(a, {
                    labels: ["Person", "Actor"],
                })
                    .related(rel, {
                        type: "ACTED_IN",
                        properties: {
                            roles: Cypher.plus(new Cypher.Literal("The "), new Cypher.Literal("Matrix")),
                        },
                    })
                    .to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:Person&Actor)-[this1:ACTED_IN { roles: ('The ' + 'Matrix') }]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Long relationship Pattern", () => {
            const a = new Cypher.Node();
            const b = new Cypher.Node();
            const c = new Cypher.Node();

            const rel1 = new Cypher.Relationship();
            const rel2 = new Cypher.Relationship();

            const query = new TestClause(
                new Cypher.Pattern(a)
                    .related(rel1, { type: "ACTED_IN" })
                    .to(b)
                    .related(rel2, { type: "ACTED_IN" })
                    .to(c, { labels: ["TestLabel"] })
            );

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(
                `"(this0)-[this1:ACTED_IN]->(this2)-[this3:ACTED_IN]->(this4:TestLabel)"`
            );

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Escape relationship type if needed", () => {
            const a = new Cypher.Node();
            const b = new Cypher.Node();
            const rel = new Cypher.Relationship();

            const query = new TestClause(new Cypher.Pattern(a).related(rel, { type: "ACTE`D_IN" }).to(b));
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:\`ACTE\`\`D_IN\`]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Relationship Pattern without type", () => {
            const a = new Cypher.Node();
            const rel = new Cypher.Variable();

            const query = new TestClause(new Cypher.Pattern(a).related(rel).to());
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[var1]->()"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Relationship Pattern with Cypher.Node | undefined variable", () => {
            const a = new Cypher.Node();
            const rel = new Cypher.Variable();

            const query = new TestClause(new Cypher.Pattern(a).related(rel).to(a));
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[var1]->(this0)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Relationship Pattern with different directions", () => {
            const a = new Cypher.Node();
            const rel = new Cypher.Relationship();

            const leftPattern = new Cypher.Pattern(a).related(rel, { type: "REL", direction: "left" }).to({});
            const rightPattern = new Cypher.Pattern(a).related(rel, { type: "REL", direction: "right" }).to({});
            const undirectedPattern = new Cypher.Pattern(a)
                .related(rel, { type: "REL", direction: "undirected" })
                .to({});

            expect(new TestClause(leftPattern).build().cypher).toMatchInlineSnapshot(`"(this0)<-[this1:REL]-()"`);
            expect(new TestClause(rightPattern).build().cypher).toMatchInlineSnapshot(`"(this0)-[this1:REL]->()"`);
            expect(new TestClause(undirectedPattern).build().cypher).toMatchInlineSnapshot(`"(this0)-[this1:REL]-()"`);
        });
    });

    describe("Variable length", () => {
        const a = new Cypher.Node();
        const b = new Cypher.Node();
        const actedInRelationship = new Cypher.Relationship();

        test("variable length with exact value", () => {
            const query = new TestClause(
                new Cypher.Pattern(a).related(actedInRelationship, { type: "ACTED_IN", length: 2 }).to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*2]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with *", () => {
            const query = new TestClause(
                new Cypher.Pattern(a).related(actedInRelationship, { length: "*", type: "ACTED_IN" }).to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with max only", () => {
            const query = new TestClause(
                new Cypher.Pattern(a).related(actedInRelationship, { type: "ACTED_IN", length: { max: 2 } }).to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*..2]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with min only", () => {
            const query = new TestClause(
                new Cypher.Pattern(a).related(actedInRelationship, { type: "ACTED_IN", length: { min: 2 } }).to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*2..]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with min and max", () => {
            const query = new TestClause(
                new Cypher.Pattern(a)
                    .related(actedInRelationship, { type: "ACTED_IN", length: { min: 2, max: 4 } })
                    .to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*2..4]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with exact value and properties", () => {
            const query = new TestClause(
                new Cypher.Pattern(a)
                    .related(actedInRelationship, {
                        properties: {
                            value: new Cypher.Param(100),
                        },
                        length: 2,
                        type: "ACTED_IN",
                    })
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
            const query = new TestClause(new Cypher.Pattern(a).related({ length: 2 }).to(b));
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[*2]->(this1)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with 0 exact", () => {
            const query = new TestClause(
                new Cypher.Pattern(a).related(actedInRelationship, { type: "ACTED_IN", length: 0 }).to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*0]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with 0 min", () => {
            const query = new TestClause(
                new Cypher.Pattern(a).related(actedInRelationship, { type: "ACTED_IN", length: { min: 0 } }).to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*0..]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("variable length with 0 max", () => {
            const query = new TestClause(
                new Cypher.Pattern(a).related(actedInRelationship, { type: "ACTED_IN", length: { max: 0 } }).to(b)
            );
            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1:ACTED_IN*..0]->(this2)"`);

            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });
    });

    describe("Where predicate", () => {
        test("Node pattern with where predicate", () => {
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: ["TestLabel"] }).where(
                Cypher.eq(node.property("name"), new Cypher.Literal("Keanu"))
            );
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel WHERE this0.name = 'Keanu')"`);
        });

        test("Node pattern with where predicate and properties", () => {
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, {
                labels: ["TestLabel"],
                properties: {
                    released: new Cypher.Literal(1999),
                },
            })
                .where(Cypher.eq(node.property("name"), new Cypher.Literal("Keanu")))
                .related({})
                .to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel { released: 1999 } WHERE this0.name = 'Keanu')-[]->(this1)"`);
        });

        test("Node pattern with where predicate in target node", () => {
            const node = new Cypher.Node();

            const pattern = new Cypher.Pattern(node, { labels: ["TestLabel"] })
                .related({})
                .to(new Cypher.Variable())
                .where(Cypher.eq(node.property("name"), new Cypher.Literal("Keanu")));
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel)-[]->(var1 WHERE this0.name = 'Keanu')"`);
        });

        test("Relationship pattern with where predicate", () => {
            const node = new Cypher.Node();
            const relationship = new Cypher.Relationship();

            const pattern = new Cypher.Pattern(node, { labels: ["TestLabel"] })
                .related(relationship, { type: "ACTED_IN" })
                .where(Cypher.eq(relationship.property("role"), new Cypher.Literal("Neo")))
                .to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel)-[this1:ACTED_IN WHERE this1.role = 'Neo']->(this2)"`);
        });

        test("Relationship pattern with where predicate and properties", () => {
            const node = new Cypher.Node();
            const relationship = new Cypher.Relationship();

            const pattern = new Cypher.Pattern(node, { labels: ["TestLabel"] })
                .related(relationship, {
                    type: "ACTED_IN",
                    properties: {
                        test: new Cypher.Literal("hello"),
                    },
                })
                .where(Cypher.eq(relationship.property("role"), new Cypher.Literal("Neo")))
                .to(new Cypher.Node());
            const queryResult = new TestClause(pattern).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0:TestLabel)-[this1:ACTED_IN WHERE this1.role = 'Neo' { test: 'hello' }]->(this2)"`);
        });
    });

    test("Using variables and config", () => {
        const a = new Cypher.Variable();
        const b = new Cypher.Variable();
        const rel = new Cypher.Variable();

        const pattern = new Cypher.Pattern(a, { labels: ["Movie"] }).related(rel, { type: "ACTED_IN" }).to(b);

        const query = new TestClause(pattern);
        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"(var0:Movie)-[var1:ACTED_IN]->(var2)"`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Pattern with empty strings as labels and types", () => {
        const a = new Cypher.Node();
        const b = new Cypher.Node();
        const rel = new Cypher.Relationship();

        const query = new TestClause(new Cypher.Pattern(a, { labels: [""] }).related(rel, { type: "" }).to(b));
        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"(this0)-[this1]->(this2)"`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
