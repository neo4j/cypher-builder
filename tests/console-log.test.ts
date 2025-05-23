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

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Cypher from "../src";

const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");

describe("Console.log", () => {
    test("Console.log on a clause", () => {
        const releasedParam = new Cypher.Param(1999);

        const movieNode = new Cypher.Node();

        const query = new Cypher.Create(
            new Cypher.Pattern(movieNode, {
                labels: ["Movie"],
            })
        ).set(
            [movieNode.property("released"), releasedParam] // Explicitly defines the node property
        );

        expect(`${query}`).toMatchInlineSnapshot(`
            "<Clause Create> \\"\\"\\"
                CREATE (this0:Movie)
                SET
                    this0.released = $param0
            \\"\\"\\""
        `);
        expect(query.toString()).toMatchInlineSnapshot(`
            "<Clause Create> \\"\\"\\"
                CREATE (this0:Movie)
                SET
                    this0.released = $param0
            \\"\\"\\""
        `);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((query as any)[customInspectSymbol]()).toMatchInlineSnapshot(`
            "<Clause Create> \\"\\"\\"
                CREATE (this0:Movie)
                SET
                    this0.released = $param0
            \\"\\"\\""
        `);
    });

    test("console.log on a pattern", () => {
        const a = new Cypher.Node();

        const pattern = new Cypher.Pattern(a).related().to();

        expect(`${pattern}`).toMatchInlineSnapshot(`
"<Pattern> \\"\\"\\"
    (this0)-[]->()
\\"\\"\\""
`);
        expect(pattern.toString()).toMatchInlineSnapshot(`
"<Pattern> \\"\\"\\"
    (this0)-[]->()
\\"\\"\\""
`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((pattern as any)[customInspectSymbol]()).toMatchInlineSnapshot(`
"<Pattern> \\"\\"\\"
    (this0)-[]->()
\\"\\"\\""
`);
    });
});
