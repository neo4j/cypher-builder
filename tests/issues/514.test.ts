import * as Cypher from "../../src";

describe("https://github.com/neo4j/cypher-builder/pull/514", () => {
    test("SET should allow PropertyRef values", () => {
        const movie = new Cypher.Node();
        const update = new Cypher.Param({
            title: "The Matrix",
            year: 1999,
        });

        const pattern = new Cypher.Pattern(movie, {
            labels: "Movie",
            properties: {
                title: new Cypher.Property(update, "title"),
            },
        });

        const matchQuery = new Cypher.Match(pattern).set([movie, new Cypher.Property(update, "year")]);

        const queryResult = matchQuery.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie { title: $param0.title })
SET
    this0 = $param0.year"
`);
    });

    test("SET with += mutation should allow PropertyRef values", () => {
        const movie = new Cypher.Node();
        const update = new Cypher.Param({
            title: "The Matrix",
            year: 1999,
        });

        const pattern = new Cypher.Pattern(movie, {
            labels: "Movie",
            properties: {
                title: new Cypher.Property(update, "title"),
            },
        });

        const matchQuery = new Cypher.Match(pattern).set([movie, "+=", new Cypher.Property(update, "year")]);

        const queryResult = matchQuery.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie { title: $param0.title })
SET
    this0 += $param0.year"
`);
    });
});
