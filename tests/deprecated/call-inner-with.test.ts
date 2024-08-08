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

describe("CypherBuilder Call - Deprecated", () => {
    test("CALL with inner with - Deprecated", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node)
            .where(Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb")))
            .return([node.property("title"), "movie"]);

        const clause = new Cypher.Call(matchClause).innerWith(node);
        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CALL {
                WITH this0
                MATCH (this0:Movie)
                WHERE $param0 = $param1
                RETURN this0.title AS movie
            }"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "aa",
              "param1": "bb",
            }
        `);
    });

    test("CALL with inner with *", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node).return([node.property("title"), "movie"]);

        const clause = new Cypher.Call(matchClause).innerWith("*");
        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CALL {
                WITH *
                MATCH (this0:Movie)
                RETURN this0.title AS movie
            }"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
    test("CALL with inner with * and extra fields", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node).return([node.property("title"), "movie"]);

        const clause = new Cypher.Call(matchClause).innerWith(node, "*");
        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CALL {
                WITH *, this0
                MATCH (this0:Movie)
                RETURN this0.title AS movie
            }"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("CALL with inner with without parameters", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node)
            .where(Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb")))
            .return([node.property("title"), "movie"]);

        const clause = new Cypher.Call(matchClause).innerWith();
        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CALL {
                MATCH (this0:Movie)
                WHERE $param0 = $param1
                RETURN this0.title AS movie
            }"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "aa",
              "param1": "bb",
            }
        `);
    });

    test("CALL with inner with multiple parameters", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node)
            .where(Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb")))
            .return([node.property("title"), "movie"]);

        const clause = new Cypher.Call(matchClause).innerWith(node, new Cypher.Variable());
        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CALL {
                WITH this0, var1
                MATCH (this0:Movie)
                WHERE $param0 = $param1
                RETURN this0.title AS movie
            }"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "aa",
              "param1": "bb",
            }
        `);
    });

    test("CALL with inner with fails if inner with is already set", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node)
            .where(Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb")))
            .return([node.property("title"), "movie"]);

        const clause = new Cypher.Call(matchClause).innerWith(node);
        expect(() => {
            clause.innerWith(node);
        }).toThrow("Call import already set");
    });

    test("Union in CALL statement with inner with", () => {
        const returnVar = new Cypher.Variable();
        const n1 = new Cypher.Node({ labels: ["Movie"] });
        const query1 = new Cypher.Match(n1).return([n1, returnVar]);
        const n2 = new Cypher.Node({ labels: ["Movie"] });
        const query2 = new Cypher.Match(n2).return([n2, returnVar]);
        const n3 = new Cypher.Node({ labels: ["Movie"] });
        const query3 = new Cypher.Match(n3).return([n3, returnVar]);

        const unionQuery = new Cypher.Union(query1, query2, query3);
        const callQuery = new Cypher.Call(unionQuery).innerWith(new Cypher.Variable());
        const queryResult = callQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CALL {
    WITH var0
    MATCH (this1:Movie)
    RETURN this1 AS var2
    UNION
    MATCH (this3:Movie)
    RETURN this3 AS var2
    UNION
    MATCH (this4:Movie)
    RETURN this4 AS var2
}"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
