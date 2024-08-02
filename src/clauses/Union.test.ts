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

import * as Cypher from "../Cypher";

describe("CypherBuilder UNION", () => {
    test("Union Movies", () => {
        const returnVar = new Cypher.Variable();
        const n1 = new Cypher.Node();
        const query1 = new Cypher.Match(new Cypher.Pattern(n1, { labels: ["Movie"] })).return([n1, returnVar]);
        const n2 = new Cypher.Node();
        const query2 = new Cypher.Match(new Cypher.Pattern(n2, { labels: ["Movie"] })).return([n2, returnVar]);
        const n3 = new Cypher.Node();
        const query3 = new Cypher.Match(new Cypher.Pattern(n3, { labels: ["Movie"] })).return([n3, returnVar]);

        const unionQuery = new Cypher.Union(query1, query2, query3);
        const queryResult = unionQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            RETURN this0 AS var1
            UNION
            MATCH (this2:Movie)
            RETURN this2 AS var1
            UNION
            MATCH (this3:Movie)
            RETURN this3 AS var1"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Union ALL Movies", () => {
        const returnVar = new Cypher.Variable();
        const n1 = new Cypher.Node();
        const query1 = new Cypher.Match(new Cypher.Pattern(n1, { labels: ["Movie"] })).return([n1, returnVar]);
        const n2 = new Cypher.Node();
        const query2 = new Cypher.Match(new Cypher.Pattern(n2, { labels: ["Movie"] })).return([n2, returnVar]);
        const n3 = new Cypher.Node();
        const query3 = new Cypher.Match(new Cypher.Pattern(n3, { labels: ["Movie"] })).return([n3, returnVar]);

        const unionQuery = new Cypher.Union(query1, query2, query3).all();
        const queryResult = unionQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            RETURN this0 AS var1
            UNION ALL
            MATCH (this2:Movie)
            RETURN this2 AS var1
            UNION ALL
            MATCH (this3:Movie)
            RETURN this3 AS var1"
        `);
    });

    test("Union DISTINCT Movies", () => {
        const returnVar = new Cypher.Variable();
        const n1 = new Cypher.Node();
        const query1 = new Cypher.Match(new Cypher.Pattern(n1, { labels: ["Movie"] })).return([n1, returnVar]);
        const n2 = new Cypher.Node();
        const query2 = new Cypher.Match(new Cypher.Pattern(n2, { labels: ["Movie"] })).return([n2, returnVar]);
        const n3 = new Cypher.Node();
        const query3 = new Cypher.Match(new Cypher.Pattern(n3, { labels: ["Movie"] })).return([n3, returnVar]);

        const unionQuery = new Cypher.Union(query1, query2, query3).distinct();
        const queryResult = unionQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            RETURN this0 AS var1
            UNION DISTINCT
            MATCH (this2:Movie)
            RETURN this2 AS var1
            UNION DISTINCT
            MATCH (this3:Movie)
            RETURN this3 AS var1"
        `);
    });

    test("Union in CALL statement with import with", () => {
        const returnVar = new Cypher.Variable();
        const n1 = new Cypher.Node();
        const query1 = new Cypher.Match(new Cypher.Pattern(n1, { labels: ["Movie"] })).return([n1, returnVar]);
        const n2 = new Cypher.Node();
        const query2 = new Cypher.Match(new Cypher.Pattern(n2, { labels: ["Movie"] })).return([n2, returnVar]);
        const n3 = new Cypher.Node();
        const query3 = new Cypher.Match(new Cypher.Pattern(n3, { labels: ["Movie"] })).return([n3, returnVar]);

        const unionQuery = new Cypher.Union(query1, query2, query3);
        const callQuery = new Cypher.Call(unionQuery).importWith(new Cypher.Variable());
        const queryResult = callQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CALL {
    WITH var0
    MATCH (this1:Movie)
    RETURN this1 AS var2
    UNION
    WITH var0
    MATCH (this3:Movie)
    RETURN this3 AS var2
    UNION
    WITH var0
    MATCH (this4:Movie)
    RETURN this4 AS var2
}"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
    test("Union in concat in CALL statement with import with", () => {
        const returnVar = new Cypher.Variable();
        const n1 = new Cypher.Node();
        const query1 = new Cypher.Match(new Cypher.Pattern(n1, { labels: ["Movie"] })).return([n1, returnVar]);
        const n2 = new Cypher.Node();
        const query2 = new Cypher.Match(new Cypher.Pattern(n2, { labels: ["Movie"] })).return([n2, returnVar]);
        const n3 = new Cypher.Node();
        const query3 = new Cypher.Match(new Cypher.Pattern(n3, { labels: ["Movie"] })).return([n3, returnVar]);

        const unionQuery = new Cypher.Union(query1, query2, query3);
        const callQuery = new Cypher.Call(Cypher.concat(unionQuery)).importWith(new Cypher.Variable());
        const queryResult = callQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CALL {
    WITH var0
    MATCH (this1:Movie)
    RETURN this1 AS var2
    UNION
    WITH var0
    MATCH (this3:Movie)
    RETURN this3 AS var2
    UNION
    WITH var0
    MATCH (this4:Movie)
    RETURN this4 AS var2
}"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("Union in nested CALL statement should not append top import with", () => {
        const returnVar = new Cypher.Variable();
        const n1 = new Cypher.Node();
        const query1 = new Cypher.Match(new Cypher.Pattern(n1, { labels: ["Movie"] })).return([n1, returnVar]);
        const n2 = new Cypher.Node();
        const query2 = new Cypher.Match(new Cypher.Pattern(n2, { labels: ["Movie"] })).return([n2, returnVar]);
        const n3 = new Cypher.Node();
        const query3 = new Cypher.Match(new Cypher.Pattern(n3, { labels: ["Movie"] })).return([n3, returnVar]);

        const unionQuery = new Cypher.Union(query1, query2, query3);
        const callQuery = new Cypher.Call(new Cypher.Call(unionQuery)).importWith(new Cypher.Variable());
        const queryResult = callQuery.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CALL {
    WITH var0
    CALL {
        MATCH (this1:Movie)
        RETURN this1 AS var2
        UNION
        MATCH (this3:Movie)
        RETURN this3 AS var2
        UNION
        MATCH (this4:Movie)
        RETURN this4 AS var2
    }
}"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });
});
