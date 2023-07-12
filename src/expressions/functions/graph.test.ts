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

import { TestClause } from "../../utils/TestClause";
import Cypher from "../..";

describe("Graph Functions", () => {
    test("graph.names()", () => {
        const labelsFn = Cypher.graph.names();

        const queryResult = new TestClause(labelsFn).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"graph.names()"`);
    });

    test("graph.propertiesByName()", () => {
        const labelsFn = Cypher.graph.propertiesByName(new Cypher.Variable());

        const queryResult = new TestClause(labelsFn).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"graph.propertiesByName(var0)"`);
    });

    test("graph.byName()", () => {
        const labelsFn = Cypher.graph.byName(new Cypher.Variable());

        const queryResult = new TestClause(labelsFn).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"graph.propertiesByName(var0)"`);
    });
});
