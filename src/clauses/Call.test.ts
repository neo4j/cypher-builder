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

describe("CypherBuilder Call", () => {
    test("Wraps query inside Call", () => {
        const idParam = new Cypher.Param("my-id");
        const movieNode = new Cypher.Node({
            labels: ["Movie"],
        });

        const createQuery = new Cypher.Create(movieNode).set([movieNode.property("id"), idParam]).return(movieNode);
        const queryResult = new Cypher.Call(createQuery).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CALL {
                CREATE (this0:Movie)
                SET
                    this0.id = $param0
                RETURN this0
            }"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "my-id",
            }
        `);
    });

    test("Nested Call", () => {
        const idParam = new Cypher.Param("my-id");
        const movieNode = new Cypher.Node({
            labels: ["Movie"],
        });

        const createQuery = new Cypher.Create(movieNode).set([movieNode.property("id"), idParam]).return(movieNode);
        const nestedCall = new Cypher.Call(createQuery);
        const call = new Cypher.Call(nestedCall);
        const queryResult = call.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CALL {
                CALL {
                    CREATE (this0:Movie)
                    SET
                        this0.id = $param0
                    RETURN this0
                }
            }"
        `);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "my-id",
            }
        `);
    });

    test("CALL with import with", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node)
            .where(Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb")))
            .return([node.property("title"), "movie"]);

        const clause = new Cypher.Call(matchClause).importWith(node);
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

    test("CALL with import with *", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node).return([node.property("title"), "movie"]);

        const clause = new Cypher.Call(matchClause).importWith("*");
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

    test("CALL with import with * and extra fields", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node).return([node.property("title"), "movie"]);

        const clause = new Cypher.Call(matchClause).importWith(node, "*");
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

    test("CALL with import with without parameters", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node)
            .where(Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb")))
            .return([node.property("title"), "movie"]);

        const clause = new Cypher.Call(matchClause).importWith();
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

    test("CALL with import with multiple parameters", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node)
            .where(Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb")))
            .return([node.property("title"), "movie"]);

        const clause = new Cypher.Call(matchClause).importWith(node, new Cypher.Variable());
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

    test("CALL with import with fails if import with is already set", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node)
            .where(Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb")))
            .return([node.property("title"), "movie"]);

        const clause = new Cypher.Call(matchClause).importWith(node);
        expect(() => {
            clause.importWith(node);
        }).toThrow("Call import already set");
    });

    test("CALL with external with", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node)
            .where(Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb")))
            .return([node.property("title"), "movie"]);

        const clause = new Cypher.Call(matchClause).with("*");
        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CALL {
                MATCH (this0:Movie)
                WHERE $param0 = $param1
                RETURN this0.title AS movie
            }
            WITH *"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "aa",
              "param1": "bb",
            }
        `);
    });

    test("CALL with external with, set and remove", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node)
            .where(Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb")))
            .return(node);

        const clause = new Cypher.Call(matchClause)
            .set([node.property("title"), new Cypher.Param("movie")])
            .remove(node.property("title"))
            .with("*");
        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CALL {
    MATCH (this0:Movie)
    WHERE $param0 = $param1
    RETURN this0
}
SET
    this0.title = $param2
REMOVE this0.title
WITH *"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "aa",
  "param1": "bb",
  "param2": "movie",
}
`);
    });

    test("CALL with external with clause", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node)
            .where(Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb")))
            .return([node.property("title"), "movie"]);

        const clause = new Cypher.Call(matchClause).with(new Cypher.With("*"));
        const queryResult = clause.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CALL {
                MATCH (this0:Movie)
                WHERE $param0 = $param1
                RETURN this0.title AS movie
            }
            WITH *"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "aa",
              "param1": "bb",
            }
        `);
    });

    test("CALL with unwind", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });
        const movie = new Cypher.Variable();

        const matchClause = new Cypher.Match(node)
            .where(Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb")))
            .return([node.property("title"), movie]);

        const clause = new Cypher.Call(matchClause).unwind([movie, "m"]);
        const queryResult = clause.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CALL {
                MATCH (this0:Movie)
                WHERE $param0 = $param1
                RETURN this0.title AS var1
            }
            UNWIND var1 AS m"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "aa",
              "param1": "bb",
            }
        `);
    });

    test("CALL with unwind passed as a clause", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });
        const movie = new Cypher.Variable();

        const matchClause = new Cypher.Match(node)
            .where(Cypher.eq(new Cypher.Param("aa"), new Cypher.Param("bb")))
            .return([node.property("title"), movie]);

        const unwindClause = new Cypher.Unwind([movie, "m"]);

        const clause = new Cypher.Call(matchClause).unwind(unwindClause);
        const queryResult = clause.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
            "CALL {
                MATCH (this0:Movie)
                WHERE $param0 = $param1
                RETURN this0.title AS var1
            }
            UNWIND var1 AS m"
        `);

        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "aa",
              "param1": "bb",
            }
        `);
    });

    test("CALL with delete", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });

        const matchClause = new Cypher.Match(node)
            .where(Cypher.eq(node.property("title"), new Cypher.Param("bb")))
            .return(node);

        const clause = new Cypher.Call(matchClause).delete(node);
        const queryResult = clause.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CALL {
    MATCH (this0:Movie)
    WHERE this0.title = $param0
    RETURN this0
}
DELETE this0"
`);

        expect(queryResult.params).toMatchInlineSnapshot(`
{
  "param0": "bb",
}
`);
    });

    test("Call returns a variable", () => {
        const idParam = new Cypher.Param("my-id");
        const movieNode = new Cypher.Node({
            labels: ["Movie"],
        });

        const variable = new Cypher.Variable();
        const createQuery = new Cypher.Create(movieNode).set([movieNode.property("id"), idParam]).return(variable);
        const queryResult = new Cypher.Call(createQuery).return(variable).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CALL {
    CREATE (this0:Movie)
    SET
        this0.id = $param0
    RETURN var1
}
RETURN var1"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "my-id",
            }
        `);
    });

    test("Call in transaction", () => {
        const node = new Cypher.Node();
        const deleteSubquery = new Cypher.With(node).detachDelete(node);

        const query = Cypher.concat(new Cypher.Match(node), new Cypher.Call(deleteSubquery).inTransactions());

        const queryResult = query.build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
    WITH this0
    DETACH DELETE this0
} IN TRANSACTIONS"
`);
    });
});
