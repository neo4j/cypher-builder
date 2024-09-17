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

describe("RelationshipRef", () => {
    test("Create relationships", () => {
        const rel1 = new Cypher.Relationship();
        const rel2 = new Cypher.Relationship();

        const testClause = new TestClause(rel1, rel2);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"this0this1"`);

        expect(rel1.type).toBeUndefined();
        expect(rel2.type).toBeUndefined();
    });

    test("Create named relationship", () => {
        const rel1 = new Cypher.NamedRelationship("myRel");

        const testClause = new TestClause(rel1);

        const queryResult = testClause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"myRel"`);
        expect(rel1.name).toBe("myRel");
    });
});
