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

describe("Pattern comprehension", () => {
    test("comprehension with filter", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });
        const andExpr = Cypher.eq(node.property("released"), new Cypher.Param(1999));

        const comprehension = new Cypher.PatternComprehension(node, andExpr);

        const queryResult = new TestClause(comprehension).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"[(this0:\`Movie\`) | this0.released = $param0]"`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 1999,
            }
        `);
    });

    test("comprehension without filter", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const comprehension = new Cypher.PatternComprehension(node);

        const queryResult = new TestClause(comprehension).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`"[(this0:\`Movie\`)]"`);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("comprehension from relationship pattern", () => {
        const a = new Cypher.Node();
        const b = new Cypher.Node();
        const rel = new Cypher.Relationship({
            type: "ACTED_IN",
        });

        const pattern = new Cypher.Pattern(a).related(rel).to(b);

        const andExpr = Cypher.eq(rel.property("released"), new Cypher.Param(1999));

        const comprehension = new Cypher.PatternComprehension(pattern, andExpr);

        const queryResult = new TestClause(comprehension).build();

        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"[(this1)-[this0:ACTED_IN]->(this2) | this0.released = $param0]"`
        );

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 1999,
            }
        `);
    });
});
