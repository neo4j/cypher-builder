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

import Cypher from "../../index";

describe("genai functions", () => {
    describe("genai.vector.encode", () => {
        test("Basic encode", () => {
            const encodeFunction = Cypher.genai.vector.encode(new Cypher.Literal("embeddings are cool"), "VertexAI", {
                token: new Cypher.Literal("my-token"),
                projectId: new Cypher.Literal("my-project"),
            });

            const result = new Cypher.With([encodeFunction, new Cypher.Variable()]);

            const { cypher, params } = result.build();

            expect(cypher).toMatchInlineSnapshot(
                `"WITH genai.vector.encode('embeddings are cool', 'VertexAI', {token: 'my-token', projectId: 'my-project'}) AS var0"`
            );
            expect(params).toMatchInlineSnapshot(`{}`);
        });
        test("Encode with query and return", () => {
            const asQueryString = new Cypher.Variable();
            const asQueryVector = new Cypher.Variable();
            const node = new Cypher.Variable();
            const score = new Cypher.Variable();

            const vectorQueryNodesCall = Cypher.db.index.vector
                .queryNodes("my_index", 10, asQueryVector)
                .yield(["node", node], ["score", score])
                .return(node, score);

            const encodeFunction = Cypher.genai.vector.encode(asQueryString, "OpenAI", {
                token: new Cypher.Param("my-token"),
                model: "my-model",
                dimensions: 512,
            });

            const result = Cypher.utils.concat(
                new Cypher.With([new Cypher.Literal("embeddings are cool"), asQueryString]),
                new Cypher.With([encodeFunction, asQueryVector]),
                vectorQueryNodesCall
            );

            const { cypher, params } = result.build();

            expect(cypher).toMatchInlineSnapshot(`
"WITH 'embeddings are cool' AS var0
WITH genai.vector.encode(var0, 'OpenAI', {token: $param0, model: 'my-model', dimensions: 512}) AS var1
CALL db.index.vector.queryNodes('my_index', 10, var1) YIELD node AS var2, score AS var3
RETURN var2, var3"
`);
            expect(params).toMatchInlineSnapshot(`
                {
                  "param0": "my-token",
                }
            `);
        });
    });
});

describe("genai procedures", () => {
    describe("genai.vector.encodeBatch", () => {
        const textToEmbed = new Cypher.List([
            new Cypher.Literal("embeddings are cool"),
            new Cypher.Literal("I love embeddings"),
        ]);

        test("String provider value", () => {
            const genAiEncodeFunction = Cypher.genai.vector.encodeBatch(textToEmbed, "OpenAI", {
                token: "my-token",
                projectId: "my-project",
            });

            const { cypher, params } = genAiEncodeFunction.build();

            expect(cypher).toMatchInlineSnapshot(
                `"CALL genai.vector.encodeBatch(['embeddings are cool', 'I love embeddings'], 'OpenAI', {token: 'my-token', projectId: 'my-project'})"`
            );
            expect(params).toMatchInlineSnapshot(`{}`);
        });
        test("Cypher.Literal provider value", () => {
            const genAiEncodeFunction = Cypher.genai.vector.encodeBatch(textToEmbed, "OpenAI", {
                token: new Cypher.Literal("my-token"),
                projectId: new Cypher.Literal("my-project"),
            });

            const { cypher, params } = genAiEncodeFunction.build();

            expect(cypher).toMatchInlineSnapshot(
                `"CALL genai.vector.encodeBatch(['embeddings are cool', 'I love embeddings'], 'OpenAI', {token: 'my-token', projectId: 'my-project'})"`
            );
            expect(params).toMatchInlineSnapshot(`{}`);
        });
        test("Cypher.Param provider value", () => {
            const genAiEncodeFunction = Cypher.genai.vector.encodeBatch(textToEmbed, new Cypher.Param("OpenAI"), {
                token: new Cypher.Literal("my-token"),
                projectId: new Cypher.Literal("my-project"),
            });

            const { cypher, params } = genAiEncodeFunction.build();

            expect(cypher).toMatchInlineSnapshot(
                `"CALL genai.vector.encodeBatch(['embeddings are cool', 'I love embeddings'], $param0, {token: 'my-token', projectId: 'my-project'})"`
            );
            expect(params).toMatchInlineSnapshot(`
                {
                  "param0": "OpenAI",
                }
            `);
        });
        test("encodeBatch with variable configuration values", () => {
            const configurationValue = {
                token: new Cypher.Literal("my-token"),
                resource: "my-resource-name",
                deployment: new Cypher.Param("my-deployment"),
                dimensions: 512,
            };

            const genAiEncodeFunction = Cypher.genai.vector.encodeBatch(textToEmbed, "AzureOpenAI", configurationValue);

            const { cypher, params } = genAiEncodeFunction.build();

            expect(cypher).toMatchInlineSnapshot(
                `"CALL genai.vector.encodeBatch(['embeddings are cool', 'I love embeddings'], 'AzureOpenAI', {token: 'my-token', resource: 'my-resource-name', deployment: $param0, dimensions: 512})"`
            );
            expect(params).toMatchInlineSnapshot(`
                {
                  "param0": "my-deployment",
                }
            `);
        });
        test("encodeBatch with query and return", () => {
            const index = new Cypher.Variable();
            const vector = new Cypher.Variable();
            const resource = new Cypher.Variable();

            const encodeBatchProcedure = Cypher.genai.vector
                .encodeBatch(textToEmbed, "OpenAI", {
                    token: new Cypher.Param("my-token"),
                    model: "my-model",
                    dimensions: 512,
                })
                .yield(["index", index], ["vector", vector], ["resource", resource])
                .return(index, vector, resource);

            const { cypher, params } = encodeBatchProcedure.build();

            expect(cypher).toMatchInlineSnapshot(`
"CALL genai.vector.encodeBatch(['embeddings are cool', 'I love embeddings'], 'OpenAI', {token: $param0, model: 'my-model', dimensions: 512}) YIELD index AS var0, vector AS var1, resource AS var2
RETURN var0, var1, var2"
`);
            expect(params).toMatchInlineSnapshot(`
                {
                  "param0": "my-token",
                }
            `);
        });
    });
});
