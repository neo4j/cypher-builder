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
import { TestClause } from "../utils/TestClause";

describe("Variable", () => {
    test("Creates multiple variables", () => {
        const variable1 = new Cypher.Variable();
        const variable2 = new Cypher.Variable();

        expect(new TestClause(variable1, variable2).build().cypher).toMatchInlineSnapshot(`"var0var1"`);
    });

    test("sets an index to a variable", () => {
        const variableIndex = new Cypher.Variable().index(3);

        expect(new TestClause(variableIndex).build().cypher).toMatchInlineSnapshot(`"var0[3]"`);
    });

    test("access a property of a variable", () => {
        const variableProp = new Cypher.Variable().property("title");

        expect(new TestClause(variableProp).build().cypher).toMatchInlineSnapshot(`"var0.title"`);
    });

    test("access a property through an expression", () => {
        const variableProp = new Cypher.Variable().property(
            Cypher.plus(new Cypher.Param("foo"), new Cypher.Literal("bar"))
        );

        expect(new TestClause(variableProp).build().cypher).toMatchInlineSnapshot(`"var0[($param0 + \\"bar\\")]"`);
    });
});
