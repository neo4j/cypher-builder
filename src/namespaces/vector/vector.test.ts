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

import Cypher from "../../index";
import { TestClause } from "../../utils/TestClause";

describe("vector functions", () => {
    describe("vector.similarity", () => {
        test("vector.similarity.euclidean", () => {
            const euclideanFunction = Cypher.vector.similarity.euclidean(
                new Cypher.Literal([2.2, 1, 0.5]),
                new Cypher.Param([1, 2, 3])
            );

            const clause = new TestClause(euclideanFunction);
            const { cypher, params } = clause.build();

            expect(cypher).toMatchInlineSnapshot(`"vector.similarity.euclidean([2.2, 1, 0.5], $param0)"`);
            expect(params).toMatchInlineSnapshot(`
{
  "param0": [
    1,
    2,
    3,
  ],
}
`);
        });
        test("vector.similarity.cosine", () => {
            const cosineFunction = Cypher.vector.similarity.cosine(
                new Cypher.Literal([2.2, 1, 0.5]),
                new Cypher.Param([1, 2, 3])
            );

            const clause = new TestClause(cosineFunction);
            const { cypher, params } = clause.build();

            expect(cypher).toMatchInlineSnapshot(`"vector.similarity.cosine([2.2, 1, 0.5], $param0)"`);
            expect(params).toMatchInlineSnapshot(`
{
  "param0": [
    1,
    2,
    3,
  ],
}
`);
        });
    });
});
