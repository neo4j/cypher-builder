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

import * as Cypher from "../../src";

describe("https://github.com/neo4j/cypher-builder/issues/479", () => {
    describe("labels", () => {
        test("string with $ is properly escaped", () => {
            const movie = new Cypher.Node();
            const movieLabel = new Cypher.Variable();

            const query = new Cypher.With([new Cypher.Param("Movie"), movieLabel])
                .match(
                    new Cypher.Pattern(movie, {
                        labels: "$(this0)",
                    })
                )
                .return(Cypher.count(movie));

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH $param0 AS var0
MATCH (this1:\`$(this0)\`)
RETURN count(this1)"
`);
        });

        test("Simple example", () => {
            const movie = new Cypher.Node();

            const query = new Cypher.Match(
                new Cypher.Pattern(movie, {
                    labels: new Cypher.Param("Movie"),
                })
            ).return(Cypher.count(movie));

            const queryResult = query.build();

            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:$($param0))
RETURN count(this0)"
`);
        });

        test("Use dynamic label on pattern", () => {
            const movie = new Cypher.Node();
            const movieLabel = new Cypher.Variable();

            const query = new Cypher.With([new Cypher.Param("Movie"), movieLabel])
                .match(
                    new Cypher.Pattern(movie, {
                        labels: movieLabel,
                    })
                )
                .return(Cypher.count(movie));

            const queryResult = query.build();

            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH $param0 AS var0
MATCH (this1:$(var0))
RETURN count(this1)"
`);
        });

        test("Use dynamic label with complex expression on pattern", () => {
            const movie = new Cypher.Node();
            const movieLabel = new Cypher.Variable();

            const query = new Cypher.With([new Cypher.Param("Movie"), movieLabel])
                .match(
                    new Cypher.Pattern(movie, {
                        labels: Cypher.concat(movieLabel, new Cypher.Literal("Test")),
                    })
                )
                .return(Cypher.count(movie));

            const queryResult = query.build();

            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH $param0 AS var0
MATCH (this1:$((var0 || \\"Test\\")))
RETURN count(this1)"
`);
        });

        test("Use dynamic label on array of labels with normal labels", () => {
            const movie = new Cypher.Node();
            const movieLabel = new Cypher.Variable();

            const query = new Cypher.With([new Cypher.Param("Movie"), movieLabel])
                .match(
                    new Cypher.Pattern(movie, {
                        labels: [movieLabel, "normal$Label", new Cypher.Param("paramLabel")],
                    })
                )
                .return(Cypher.count(movie));

            const queryResult = query.build();

            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH $param0 AS var0
MATCH (this1:$(var0):\`normal$Label\`:$($param1))
RETURN count(this1)"
`);

            expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "Movie",
  "param1": "paramLabel",
}
`);
        });

        test("Use dynamic label with labelExpr", () => {
            const movie = new Cypher.Node();
            const movieLabel = new Cypher.Variable();

            const query = new Cypher.With([new Cypher.Param("Movie"), movieLabel])
                .match(
                    new Cypher.Pattern(movie, {
                        labels: Cypher.labelExpr.or(
                            movieLabel,
                            "normal$Label",
                            Cypher.labelExpr.not(new Cypher.Param("paramLabel"))
                        ),
                    })
                )
                .return(Cypher.count(movie));

            const queryResult = query.build();

            expect(queryResult.cypher).toMatchInlineSnapshot(`
"WITH $param0 AS var0
MATCH (this1:($(var0)|\`normal$Label\`|!$($param1)))
RETURN count(this1)"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "Movie",
  "param1": "paramLabel",
}
`);
        });

        test("Simple example in relationship", () => {
            const movie = new Cypher.Node();

            const query = new Cypher.Match(
                new Cypher.Pattern(movie, {
                    labels: new Cypher.Param("Movie"),
                })
                    .related()
                    .to({
                        labels: new Cypher.Param("Actor"),
                    })
            ).return(Cypher.count(movie));

            const queryResult = query.build();

            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:$($param0))-[]->(:$($param1))
RETURN count(this0)"
`);
        });
    });
});
