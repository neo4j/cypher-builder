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

describe("Path Functions", () => {
    test("nodes", () => {
        const nodesFn = Cypher.nodes(new Cypher.Path());

        const queryResult = new TestClause(nodesFn).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"nodes(p0)"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("relationships", () => {
        const relationshipsFn = Cypher.relationships(new Cypher.Path());

        const queryResult = new TestClause(relationshipsFn).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"relationships(p0)"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("NamedPath", () => {
        const nodesFn = Cypher.nodes(new Cypher.NamedPath("my_path"));

        const queryResult = new TestClause(nodesFn).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"nodes(my_path)"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("length", () => {
        const lengthFn = Cypher.length(new Cypher.Path());

        const queryResult = new TestClause(lengthFn).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"length(p0)"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
