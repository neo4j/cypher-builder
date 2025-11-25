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

import Cypher from "../..";

describe("Count Subquery", () => {
    test("Count predicate with subclause", () => {
        const subquery = new Cypher.Match(new Cypher.Pattern(new Cypher.Node(), { labels: ["Movie"] })).return("*");

        const countExpr = new Cypher.Count(subquery);
        const match = new Cypher.Match(new Cypher.Pattern(new Cypher.Node()))
            .where(Cypher.gt(countExpr, new Cypher.Literal(10)))
            .return("*");

        const queryResult = match.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
WHERE COUNT {
  MATCH (this1:Movie)
  RETURN *
} > 10
RETURN *"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Simple Count subquery", () => {
        const countExpr = new Cypher.Count(new Cypher.Pattern(new Cypher.Node(), { labels: ["Movie"] }));
        const match = new Cypher.Match(new Cypher.Pattern(new Cypher.Node()))
            .where(Cypher.gt(countExpr, new Cypher.Literal(10)))
            .return("*");

        const queryResult = match.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
WHERE COUNT {
  (this1:Movie)
} > 10
RETURN *"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
