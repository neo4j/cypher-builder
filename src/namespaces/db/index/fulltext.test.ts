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

import Cypher from "../../../index";

describe("db.index.fulltext", () => {
    describe("db.index.fulltext.queryNodes", () => {
        test("Simple fulltext", () => {
            const targetNode = new Cypher.Node();
            const fulltextProcedure = Cypher.db.index.fulltext
                .queryNodes("my-text-index", new Cypher.Param("This is a lovely phrase"))
                .yield(["node", targetNode]);

            const { cypher, params } = fulltextProcedure.build();

            expect(cypher).toMatchInlineSnapshot(
                `"CALL db.index.fulltext.queryNodes(\\"my-text-index\\", $param0) YIELD node AS this0"`
            );
            expect(params).toMatchInlineSnapshot(`
            {
              "param0": "This is a lovely phrase",
            }
        `);
        });

        test("Fulltext with where and return", () => {
            const targetNode = new Cypher.Node();
            const fulltextProcedure = Cypher.db.index.fulltext
                .queryNodes("my-text-index", new Cypher.Param("This is a lovely phrase"))
                .yield(["node", targetNode])
                .where(Cypher.eq(targetNode.property("title"), new Cypher.Param("The Matrix")))
                .return(targetNode);

            const { cypher, params } = fulltextProcedure.build();

            expect(cypher).toMatchInlineSnapshot(`
            "CALL db.index.fulltext.queryNodes(\\"my-text-index\\", $param0) YIELD node AS this0
            WHERE this0.title = $param1
            RETURN this0"
        `);
            expect(params).toMatchInlineSnapshot(`
            {
              "param0": "This is a lovely phrase",
              "param1": "The Matrix",
            }
        `);
        });

        test("Fulltext with options", () => {
            const fulltextProcedure = Cypher.db.index.fulltext.queryNodes(
                "my-text-index",
                new Cypher.Param("This is a lovely phrase"),
                {
                    skip: 5,
                    analyser: new Cypher.Param("whitespace"),
                }
            );

            const { cypher, params } = fulltextProcedure.build();

            expect(cypher).toMatchInlineSnapshot(
                `"CALL db.index.fulltext.queryNodes(\\"my-text-index\\", $param0, { skip: 5, analyser: $param1 })"`
            );
            expect(params).toMatchInlineSnapshot(`
            {
              "param0": "This is a lovely phrase",
              "param1": "whitespace",
            }
        `);
        });
    });

    describe("db.index.fulltext.queryRelationships", () => {
        test("Simple fulltext", () => {
            const targetNode = new Cypher.Node();
            const fulltextProcedure = Cypher.db.index.fulltext
                .queryRelationships("my-text-index", new Cypher.Param("This is a lovely phrase"))
                .yield(["relationship", targetNode]);

            const { cypher, params } = fulltextProcedure.build();

            expect(cypher).toMatchInlineSnapshot(
                `"CALL db.index.fulltext.queryRelationships(\\"my-text-index\\", $param0) YIELD relationship AS this0"`
            );
            expect(params).toMatchInlineSnapshot(`
            {
              "param0": "This is a lovely phrase",
            }
        `);
        });

        test("Fulltext with options", () => {
            const fulltextProcedure = Cypher.db.index.fulltext.queryRelationships(
                "my-text-index",
                new Cypher.Param("This is a lovely phrase"),
                {
                    skip: 5,
                    analyser: new Cypher.Param("whitespace"),
                }
            );

            const { cypher, params } = fulltextProcedure.build();

            expect(cypher).toMatchInlineSnapshot(
                `"CALL db.index.fulltext.queryRelationships(\\"my-text-index\\", $param0, { skip: 5, analyser: $param1 })"`
            );
            expect(params).toMatchInlineSnapshot(`
            {
              "param0": "This is a lovely phrase",
              "param1": "whitespace",
            }
        `);
        });
    });

    test("db.index.fulltext.awaitEventuallyConsistentIndexRefresh", () => {
        const procedure = Cypher.db.index.fulltext.awaitEventuallyConsistentIndexRefresh();
        const { cypher } = procedure.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL db.index.fulltext.awaitEventuallyConsistentIndexRefresh()"`);
    });

    test("db.index.fulltext.listAvailableAnalyzers", () => {
        const procedure = Cypher.db.index.fulltext
            .listAvailableAnalyzers()
            .yield("analyzer", "description", "stopwords");
        const { cypher } = procedure.build();

        expect(cypher).toMatchInlineSnapshot(
            `"CALL db.index.fulltext.queryRelationships() YIELD analyzer, description, stopwords"`
        );
    });
});
