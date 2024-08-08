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

import Cypher from "../../src";

describe("Collect Subquery - Deprecated", () => {
    test("Collect expression with subclause", () => {
        const dog = new Cypher.Node({ labels: ["Dog"] });
        const person = new Cypher.Node({ labels: ["Person"] });

        const subquery = new Cypher.Match(
            new Cypher.Pattern(person).related(new Cypher.Relationship({ type: "HAS_DOG" })).to(dog)
        ).return(dog.property("name"));

        const match = new Cypher.Match(person)
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
        const dog = new Cypher.Node({ labels: ["Dog"] });
        const cat = new Cypher.Node({ labels: ["Cat"] });
        const person = new Cypher.Node({ labels: ["Person"] });

        const matchDog = new Cypher.Match(
            new Cypher.Pattern(person).related(new Cypher.Relationship({ type: "HAS_DOG" })).to(dog)
        ).return([dog.property("name"), "petName"]);
        const matchCat = new Cypher.Match(
            new Cypher.Pattern(person).related(new Cypher.Relationship({ type: "HAS_CAT" })).to(cat)
        ).return([cat.property("name"), "petName"]);

        const subquery = new Cypher.Union(matchDog, matchCat);

        const match = new Cypher.Match(person).return(person, [new Cypher.Collect(subquery), "petNames"]);

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
