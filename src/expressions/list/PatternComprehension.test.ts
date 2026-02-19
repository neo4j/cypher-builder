/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";
import { TestClause } from "../../utils/TestClause";

describe("Pattern comprehension", () => {
    test("comprehension with map", () => {
        const node = new Cypher.Node();
        const andExpr = Cypher.eq(node.property("released"), new Cypher.Param(1999));

        const comprehension = new Cypher.PatternComprehension(new Cypher.Pattern(node, { labels: ["Movie"] })).map(
            andExpr
        );

        const queryResult = new TestClause(comprehension).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"[(this0:Movie) | this0.released = $param0]"`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 1999,
            }
        `);
    });

    test("comprehension without map", () => {
        const node = new Cypher.Node();

        const comprehension = new Cypher.PatternComprehension(new Cypher.Pattern(node, { labels: ["Movie"] }));

        const queryResult = new TestClause(comprehension).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"[(this0:Movie)]"`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("comprehension from relationship pattern", () => {
        const a = new Cypher.Node();
        const b = new Cypher.Node();
        const rel = new Cypher.Relationship();

        const pattern = new Cypher.Pattern(a)
            .related(rel, {
                type: "ACTED_IN",
            })
            .to(b);

        const andExpr = Cypher.eq(rel.property("released"), new Cypher.Param(1999));

        const comprehension = new Cypher.PatternComprehension(pattern).map(andExpr);

        const queryResult = new TestClause(comprehension).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"[(this1)-[this0:ACTED_IN]->(this2) | this0.released = $param0]"`
        );

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 1999,
            }
        `);
    });

    test("comprehension with filter", () => {
        const movie = new Cypher.Node();
        const rel = new Cypher.Relationship();
        const actor = new Cypher.Node();

        const pattern = new Cypher.Pattern(movie, { labels: ["Movie"] })
            .related(rel, {
                type: "ACTED_IN",
            })
            .to(actor, { labels: ["Actor"] });

        const comprehension = new Cypher.PatternComprehension(pattern)
            .map(actor.property("name"))
            .where(Cypher.contains(movie.property("title"), new Cypher.Literal("Matrix")));

        const queryResult = new TestClause(comprehension).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"[(this0:Movie)-[this2:ACTED_IN]->(this1:Actor) WHERE this0.title CONTAINS 'Matrix' | this1.name]"`
        );

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
