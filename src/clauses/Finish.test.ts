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

import Cypher from "..";

describe("CypherBuilder Finish", () => {
    test("Finish Clause", () => {
        const finishQuery = new Cypher.Finish();

        const queryResult = finishQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"FINISH"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Create.withFinish", () => {
        const node = new Cypher.Node();

        const createQuery = new Cypher.Create(new Cypher.Pattern(new Cypher.Node()))
            .set([node.property("test"), new Cypher.Param("Hello World")])
            .finish();

        const queryResult = createQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CREATE (this0)
SET
    this1.test = $param0
FINISH"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "Hello World",
}
`);
    });

    test("Match.withFinish", () => {
        const createQuery = new Cypher.Match(new Cypher.Pattern(new Cypher.Node())).finish();

        const queryResult = createQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
FINISH"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
