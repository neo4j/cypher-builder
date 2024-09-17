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

import Cypher from "../../src";

describe("Utils.compileCypher - Deprecated", () => {
    test("Create a custom query with RawCypher callback using compileCypher", () => {
        const releasedParam = new Cypher.Param(1999);

        const rawCypher = new Cypher.RawCypher((env: Cypher.Environment) => {
            const releasedParamId = Cypher.utils.compileCypher(releasedParam, env); // Gets the raw Cypher for the param

            const customCypher = `MATCH(n) WHERE n.title=$title_param AND n.released=${releasedParamId}`;

            const customParams = {
                title_param: "The Matrix",
            };

            return [customCypher, customParams];
        });

        const queryResult = rawCypher.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"MATCH(n) WHERE n.title=$title_param AND n.released=$param0"`
        );

        expect(queryResult.params).toMatchInlineSnapshot(`
        {
          "param0": 1999,
          "title_param": "The Matrix",
        }
    `);
    });

    test("compile cypher in Raw", () => {
        const matchClause = new Cypher.Match(new Cypher.Node({ labels: ["Movie"] })).where(
            Cypher.eq(new Cypher.Literal("first"), new Cypher.Param("first"))
        );
        const secondMatch = new Cypher.Match(new Cypher.Node({ labels: ["Movie"] })).where(
            Cypher.eq(new Cypher.Literal("Hello"), new Cypher.Param("Hello"))
        );
        const raw = new Cypher.Raw((env) => {
            return Cypher.utils.compileCypher(secondMatch, env);
        });

        const query = Cypher.concat(matchClause, raw);
        const { cypher, params } = query.build();
        expect(cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            WHERE \\"first\\" = $param0
            MATCH (this1:Movie)
            WHERE \\"Hello\\" = $param1"
        `);

        expect(params).toMatchInlineSnapshot(`
            {
              "param0": "first",
              "param1": "Hello",
            }
        `);
    });

    test("fails if env is missing", () => {
        const matchClause = new Cypher.Match(new Cypher.Node({ labels: ["Movie"] })).where(
            Cypher.eq(new Cypher.Literal("first"), new Cypher.Param("first"))
        );
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Cypher.utils.compileCypher(matchClause, undefined as any);
        }).toThrow("Missing env when compiling Cypher");
    });

    test("fails if element is not compilable", () => {
        const raw = new Cypher.Raw((env) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return Cypher.utils.compileCypher({} as any, env);
        });
        expect(() => {
            raw.build();
        }).toThrow("Invalid element, missing `getCypher` method");
    });

    test("Return empty string if compiled cypher is empty", () => {
        const fakeClause = {
            getCypher() {
                return undefined;
            },
        };
        const raw = new Cypher.Raw((env) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return Cypher.utils.compileCypher(fakeClause as any, env);
        });

        const { cypher, params } = raw.build();
        expect(cypher).toMatchInlineSnapshot(`""`);

        expect(params).toMatchInlineSnapshot(`{}`);
    });
});
