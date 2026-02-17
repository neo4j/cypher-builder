/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "..";

describe("Raw Cypher", () => {
    test("Return a simple string as a clause", () => {
        const rawQuery = new Cypher.Raw(() => {
            const cypherStr = "RETURN $myParam as title";
            return [
                cypherStr,
                {
                    param: "My Title",
                },
            ];
        });

        const queryResult = rawQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"RETURN $myParam as title"`);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param": "My Title",
            }
        `);
    });

    test("Create a custom query with Raw callback", () => {
        const releasedParam = new Cypher.Param(1999);

        const rawCypher = new Cypher.Raw((env) => {
            const releasedParamId = env.compile(releasedParam); // Gets the raw Cypher for the param

            const customCypher = `MATCH(n) WHERE n.title=$title_param AND n.released=${releasedParamId}`;

            return customCypher;
        });

        const queryResult = rawCypher.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"MATCH(n) WHERE n.title=$title_param AND n.released=$param0"`
        );

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 1999,
            }
        `);
    });

    test("Create a custom query with Raw callback passing parameters", () => {
        const releasedParam = new Cypher.Param(1999);

        const rawCypher = new Cypher.Raw((env: Cypher.RawCypherContext) => {
            const releasedParamId = env.compile(releasedParam); // Gets the raw Cypher for the param

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

    test("compile not compilable should throw", () => {
        const rawCypher = new Cypher.Raw((context) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
            const cypher = context.compile({} as any);

            return cypher;
        });

        expect(() => {
            rawCypher.build();
        }).toThrow("Can't build. Passing a non Cypher Builder element to context.compile in RawCypher");
    });

    test("Return empty string if compiled cypher is undefined", () => {
        const fakeClause = {
            getCypher() {
                return undefined;
            },
        };
        const raw = new Cypher.Raw((context) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
            return context.compile(fakeClause as any);
        });

        const { cypher, params } = raw.build();
        expect(cypher).toMatchInlineSnapshot(`""`);

        expect(params).toMatchInlineSnapshot(`{}`);
    });
});
