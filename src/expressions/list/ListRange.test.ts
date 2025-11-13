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

describe("ListRange", () => {
    test("get 0 .. 2 from list", () => {
        const list = new Cypher.List([new Cypher.Literal("1"), new Cypher.Literal("2"), new Cypher.Literal("3")]);
        const listIndex = Cypher.listRange(list, 0, 2);
        const queryResult = new TestClause(listIndex).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"['1', '2', '3'][0..2]"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("get 2 .. -1 from list", () => {
        const list = new Cypher.List([new Cypher.Literal("1"), new Cypher.Literal("2"), new Cypher.Literal("3")]);
        const listIndex = Cypher.listRange(list, 2, -1);
        const queryResult = new TestClause(listIndex).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"['1', '2', '3'][2..-1]"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("get range from arbitrary expression", () => {
        const collect = Cypher.collect(new Cypher.Variable());
        const listIndex = Cypher.listRange(collect, 2, 3);
        const queryResult = new TestClause(listIndex).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"collect(var0)[2..3]"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
