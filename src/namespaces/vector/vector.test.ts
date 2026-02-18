/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../index.js";
import { TestClause } from "../../utils/TestClause.js";

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
