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

import Cypher from "../src";

/**
 * These test check if cypher builder matches the examples in
 * https://neo4j.com/docs/cypher-manual/25/styleguide/
 *
 */
describe("Cypher styleguide", () => {
    describe("indentation", () => {
        test("Indentation Clauses", () => {
            const node = new Cypher.Node();
            const pattern = new Cypher.Pattern(node);
            const query = new Cypher.Match(pattern)
                .where(Cypher.contains(node.property("name"), new Cypher.Literal("s")))
                .return(node.property("name"));

            const { cypher } = query.build();

            expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0)
WHERE this0.name CONTAINS 's'
RETURN this0.name"
`);
        });
        test("Indentation ON CREATE and ON MERGE and clause order", () => {
            const n = new Cypher.Node();
            const a = new Cypher.Node();
            const b = new Cypher.Node();

            const pattern = new Cypher.Pattern(n);
            const query = new Cypher.Merge(pattern)
                .onCreateSet([n.property("prop"), new Cypher.Literal(0)])
                .merge(new Cypher.Pattern(a, { labels: ["A"] }).related({ type: "T" }).to(b, { labels: ["B"] }))
                .onMatchSet([a.property("name"), new Cypher.Literal("me")]) // This is put before purposefully, to check that the order is maintained as recommended
                .onCreateSet([b.property("name"), new Cypher.Literal("you")])
                .return(a.property("prop"));
            const { cypher } = query.build();

            expect(cypher).toMatchInlineSnapshot(`
"MERGE (this0)  
  ON CREATE SET this0.prop = 0  
MERGE (this1:A)-[:T]->(this2:B)  
  ON CREATE SET this2.name = 'you'  
  ON MATCH SET this1.name = 'me'
RETURN this1.prop"
`);
        });

        test("Indentation ON CREATE and ON MERGE with multiple properties", () => {
            const a = new Cypher.Node();
            const b = new Cypher.Node();

            const query = new Cypher.Merge(
                new Cypher.Pattern(a, { labels: ["A"] }).related({ type: "T" }).to(b, { labels: ["B"] })
            )
                .onMatchSet([a.property("name"), new Cypher.Literal("me")], [a.property("age"), new Cypher.Literal(30)]) // This is put before purposefully, to check that the order is maintained as recommended
                .onCreateSet([b.property("name"), new Cypher.Literal("you")])
                .return(a.property("prop"));
            const { cypher } = query.build();

            expect(cypher).toMatchInlineSnapshot(`
"MERGE (this0:A)-[:T]->(this1:B)  
  ON CREATE SET this1.name = 'you'  
  ON MATCH SET
    this0.name = 'me',
    this0.age = 30
RETURN this0.prop"
`);
        });

        test("Exists subquery", () => {
            const a = new Cypher.Node();
            const b = new Cypher.Node();

            const query = new Cypher.Match(new Cypher.Pattern(a, { labels: ["A"] }))
                .where(
                    new Cypher.Exists(
                        new Cypher.Match(new Cypher.Pattern(a).related().to(b, { labels: ["B"] })).where(
                            Cypher.eq(b.property("prop"), new Cypher.Literal("yellow"))
                        )
                    )
                )
                .return(a.property("foo"));
            const { cypher } = query.build();

            expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:A)
WHERE EXISTS {
  MATCH (this0)-[]->(this1:B)
  WHERE this1.prop = 'yellow'
}
RETURN this0.foo"
`);
        });

        // NOT YET SUPPORTED
        // MATCH (a:A)
        // WHERE EXISTS { (a)-->(b:B) }
        // RETURN a.prop
        test.todo("Exists subquery with simplified subquery");

        test("CASE ... WHEN ... ELSE", () => {
            const n = new Cypher.Node();
            const query = new Cypher.Match(
                new Cypher.Pattern(n, { labels: ["Person"], properties: { name: new Cypher.Literal("Alice") } })
            ).return([
                new Cypher.Case()
                    .when(Cypher.gt(n.property("age"), new Cypher.Literal(18)))
                    .then(new Cypher.Literal("Adult"))
                    .else(new Cypher.Literal("Minor")),
                "ageGroup",
            ]);

            const { cypher } = query.build();

            expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Person { name: 'Alice' })
RETURN CASE
  WHEN this0.age > 18 THEN 'Adult'
  ELSE 'Minor'
END AS ageGroup"
`);
        });
    });

    describe("Spacing", () => {
        test("Maps", () => {
            const variable = new Cypher.Variable();
            const query = new Cypher.With([
                new Cypher.Map({
                    key1: new Cypher.Literal("value"),
                    key2: new Cypher.Literal(42),
                }),
                variable,
            ]).return(variable);

            const { cypher } = query.build();
            expect(cypher).toMatchInlineSnapshot(`
"WITH {key1: 'value', key2: 42} AS var0
RETURN var0"
`);
        });

        test("Lists", () => {
            const variable = new Cypher.Variable();
            const query = new Cypher.With([
                new Cypher.List([new Cypher.Literal("a"), new Cypher.Literal("b"), new Cypher.Literal(3.14)]),
                variable,
            ]).return(variable, new Cypher.Literal(2));

            const { cypher } = query.build();
            expect(cypher).toMatchInlineSnapshot(`
"WITH ['a', 'b', 3.14] AS var0
RETURN var0, 2"
`);
        });
    });

    describe("Meta characters", () => {
        test("String values", () => {
            const query = new Cypher.Return(
                new Cypher.Literal("Cypher"),
                new Cypher.Literal("A 'Quote'"),
                new Cypher.Literal('Another "Quote"')
            );

            const { cypher } = query.build();
            expect(cypher).toMatchInlineSnapshot(`"RETURN 'Cypher', 'A \\\\'Quote\\\\'', 'Another \\"Quote\\"'"`);
        });
    });
});
