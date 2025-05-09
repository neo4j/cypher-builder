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
import { TestClause } from "../../utils/TestClause";

describe("concat operators", () => {
    test("concatenating strings", () => {
        const concat = Cypher.concat(new Cypher.Literal("Hello"), new Cypher.Literal("World!"));
        const { cypher } = new TestClause(concat).build();
        expect(cypher).toMatchInlineSnapshot(`"(\\"Hello\\" || \\"World!\\")"`);
    });
    test("concatenating multiple strings with params", () => {
        const concat = Cypher.concat(
            new Cypher.Literal("Hello"),
            new Cypher.Literal("World!"),
            new Cypher.Param("Thanks for all the fish")
        );
        const { cypher, params } = new TestClause(concat).build();
        expect(cypher).toMatchInlineSnapshot(`"(\\"Hello\\" || \\"World!\\" || $param0)"`);
        expect(params).toMatchInlineSnapshot(`
{
  "param0": "Thanks for all the fish",
}
`);
    });

    test("concatenating strings as part of an expression", () => {
        const node = new Cypher.Node();
        const matchSet = new Cypher.Match(new Cypher.Pattern(node)).set([
            node.property("greeting"),
            Cypher.concat(new Cypher.Literal("Hello "), node.property("name")),
        ]);
        const { cypher } = new TestClause(matchSet).build();
        expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0)
SET
    this0.greeting = (\\"Hello \\" || this0.name)"
`);
    });
});
