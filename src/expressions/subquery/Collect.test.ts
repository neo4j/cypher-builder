/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../..";

describe("Collect Subquery", () => {
    test("Collect expression with subclause", () => {
        const dog = new Cypher.Node();
        const person = new Cypher.Node();

        const subquery = new Cypher.Match(
            new Cypher.Pattern(person, { labels: ["Person"] })
                .related(new Cypher.Relationship(), { type: "HAS_DOG" })
                .to(dog, { labels: ["Dog"] })
        ).return(dog.property("name"));

        const match = new Cypher.Match(new Cypher.Pattern(person, { labels: ["Person"] }))
            .where(Cypher.in(new Cypher.Literal("Ozzy"), new Cypher.Collect(subquery)))
            .return(person);

        const queryResult = match.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Person)
WHERE \\"Ozzy\\" IN COLLECT {
    MATCH (this0:Person)-[this1:HAS_DOG]->(this2:Dog)
    RETURN this2.name
}
RETURN this0"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Return collect subquery with an union", () => {
        const dog = new Cypher.Node();
        const cat = new Cypher.Node();
        const person = new Cypher.Node();

        const matchDog = new Cypher.Match(
            new Cypher.Pattern(person, { labels: ["Person"] })
                .related(new Cypher.Relationship(), { type: "HAS_DOG" })
                .to(dog, { labels: ["Dog"] })
        ).return([dog.property("name"), "petName"]);
        const matchCat = new Cypher.Match(
            new Cypher.Pattern(person, { labels: ["Person"] })
                .related(new Cypher.Relationship(), { type: "HAS_CAT" })
                .to(cat, { labels: ["Cat"] })
        ).return([cat.property("name"), "petName"]);

        const subquery = new Cypher.Union(matchDog, matchCat);

        const match = new Cypher.Match(new Cypher.Pattern(person, { labels: ["Person"] })).return(person, [
            new Cypher.Collect(subquery),
            "petNames",
        ]);

        const queryResult = match.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Person)
RETURN this0, COLLECT {
    MATCH (this0:Person)-[this1:HAS_DOG]->(this2:Dog)
    RETURN this2.name AS petName
    UNION
    MATCH (this0:Person)-[this3:HAS_CAT]->(this4:Cat)
    RETURN this4.name AS petName
} AS petNames"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
