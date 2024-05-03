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

describe("Examples", () => {
    test("Readme example", () => {
        const movieNode = new Cypher.Node();
        const pattern = new Cypher.Pattern(movieNode, { labels: ["Movie"] });

        const matchQuery = new Cypher.Match(pattern)
            .where(movieNode, {
                title: new Cypher.Param("The Matrix"),
            })
            .return(movieNode.property("title"));

        const { cypher, params } = matchQuery.build();

        expect(cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            WHERE this0.title = $param0
            RETURN this0.title"
        `);
        expect(params).toMatchInlineSnapshot(`
            {
              "param0": "The Matrix",
            }
        `);
    });

    test("Getting started example", () => {
        const movie = new Cypher.Node();
        const query = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["Movie"] })).return([
            movie.property("title"),
            "title",
        ]);

        const { cypher, params } = query.build();

        expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
RETURN this0.title AS title"
`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("Querying example", () => {
        const movieNode = new Cypher.Node();

        const matchPattern = new Cypher.Pattern(movieNode, { labels: ["Movie"] });

        const clause = new Cypher.Match(matchPattern).return(movieNode);

        const { cypher, params } = clause.build();

        expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
RETURN this0"
`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test("relationships and advanced filtering", () => {
        const movieNode = new Cypher.Node();
        const actedIn = new Cypher.Relationship();
        const personNode = new Cypher.Node();

        const pattern = new Cypher.Pattern(movieNode, { labels: ["Movie"] })
            .related(actedIn, { type: "ACTED_IN", direction: "left" })
            .to(personNode, { labels: ["Person"] });

        const titleProp = movieNode.property("title");
        const yearProp = movieNode.property("released");
        const taglineProp = movieNode.property("tagline");
        const rolesProperty = actedIn.property("roles");

        const isKeanu = Cypher.eq(personNode.property("name"), new Cypher.Param("Keanu Reeves"));
        const titleContainsMatrix = Cypher.contains(titleProp, new Cypher.Param("The Matrix"));
        const releasedBefore2000 = Cypher.lt(yearProp, new Cypher.Param(2000));

        const clause = new Cypher.Match(pattern)
            .where(Cypher.and(isKeanu, Cypher.or(Cypher.not(titleContainsMatrix), releasedBefore2000)))
            .return(titleProp, taglineProp, yearProp, [rolesProperty, "actingRoles"]);

        const { cypher, params } = clause.build();

        expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)<-[this1:ACTED_IN]-(this2:Person)
WHERE (this2.name = $param0 AND (NOT (this0.title CONTAINS $param1) OR this0.released < $param2))
RETURN this0.title, this0.tagline, this0.released, this1.roles AS actingRoles"
`);
        expect(params).toMatchInlineSnapshot(`
{
  "param0": "Keanu Reeves",
  "param1": "The Matrix",
  "param2": 2000,
}
`);
    });

    test("Patter with direction", () => {
        const person = new Cypher.Node();
        const movie = new Cypher.Node();
        const actedIn = new Cypher.Relationship();

        const pattern = new Cypher.Pattern(person).related(actedIn, { type: "ACTED_IN", direction: "left" }).to(movie);

        const clause = new Cypher.Match(pattern);
        const { cypher } = clause.build();
        expect(cypher).toMatchInlineSnapshot(`"MATCH (this0)<-[this1:ACTED_IN]-(this2)"`);
    });
});
