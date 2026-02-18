/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "..";

describe("CypherBuilder Call", () => {
    test("Wraps query inside Call", () => {
        const idParam = new Cypher.Param("my-id");
        const movieNode = new Cypher.Node();

        const createQuery = new Cypher.Create(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
            .set([movieNode.property("id"), idParam])
            .return(movieNode);
        const queryResult = new Cypher.Call(createQuery).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CALL {
  CREATE (this0:Movie)
  SET this0.id = $param0
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
        const movieNode = new Cypher.Node();

        const createQuery = new Cypher.Create(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
            .set([movieNode.property("id"), idParam])
            .return(movieNode);
        const nestedCall = new Cypher.Call(createQuery);
        const call = new Cypher.Call(nestedCall);
        const queryResult = call.build();

        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CALL {
  CALL {
    CREATE (this0:Movie)
    SET this0.id = $param0
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

    test("CALL with external with", () => {
        const node = new Cypher.Node();

        const matchClause = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] }))
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
        const node = new Cypher.Node();

        const matchClause = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] }))
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
SET this0.title = $param2
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
        const node = new Cypher.Node();

        const matchClause = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] }))
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
        const node = new Cypher.Node();
        const movie = new Cypher.Variable();

        const matchClause = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] }))
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
        const node = new Cypher.Node();
        const movie = new Cypher.Variable();

        const matchClause = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] }))
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
        const node = new Cypher.Node();

        const matchClause = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] }))
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
        const movieNode = new Cypher.Node();

        const variable = new Cypher.Variable();
        const createQuery = new Cypher.Create(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
            .set([movieNode.property("id"), idParam])
            .return(variable);
        const queryResult = new Cypher.Call(createQuery).return(variable).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CALL {
  CREATE (this0:Movie)
  SET this0.id = $param0
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

    describe("Call in transactions", () => {
        let subquery: Cypher.Clause;
        let node: Cypher.Node;

        beforeEach(() => {
            node = new Cypher.Node();
            subquery = new Cypher.With(node).detachDelete(node);
        });

        test("Call in transactions with no options", () => {
            const query = Cypher.utils.concat(
                new Cypher.Match(new Cypher.Pattern(node)),
                new Cypher.Call(subquery).inTransactions()
            );

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
  WITH this0
  DETACH DELETE this0
} IN TRANSACTIONS"
`);
        });

        test("Call in transaction of rows", () => {
            const query = Cypher.utils.concat(
                new Cypher.Match(new Cypher.Pattern(node)),
                new Cypher.Call(subquery).inTransactions({
                    ofRows: 10,
                })
            );

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
  WITH this0
  DETACH DELETE this0
} IN TRANSACTIONS OF 10 ROWS"
`);
        });

        test("Call in transaction on error fail", () => {
            const query = Cypher.utils.concat(
                new Cypher.Match(new Cypher.Pattern(node)),
                new Cypher.Call(subquery).inTransactions({
                    onError: "fail",
                })
            );

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
  WITH this0
  DETACH DELETE this0
} IN TRANSACTIONS ON ERROR FAIL"
`);
        });

        describe("Retry", () => {
            test("Call in transaction on error retry", () => {
                const query = Cypher.utils.concat(
                    new Cypher.Match(new Cypher.Pattern(node)),
                    new Cypher.Call(subquery).inTransactions({
                        retry: true,
                    })
                );

                const queryResult = query.build();
                expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
  WITH this0
  DETACH DELETE this0
} IN TRANSACTIONS ON ERROR RETRY"
`);
            });

            test("Call in transaction on error retry seconds", () => {
                const query = Cypher.utils.concat(
                    new Cypher.Match(new Cypher.Pattern(node)),
                    new Cypher.Call(subquery).inTransactions({
                        retry: 10,
                    })
                );

                const queryResult = query.build();
                expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
  WITH this0
  DETACH DELETE this0
} IN TRANSACTIONS ON ERROR RETRY FOR 10 SECONDS"
`);
            });
            test("Call in transaction on error retry then", () => {
                const query = Cypher.utils.concat(
                    new Cypher.Match(new Cypher.Pattern(node)),
                    new Cypher.Call(subquery).inTransactions({
                        retry: true,
                        onError: "continue",
                    })
                );

                const queryResult = query.build();
                expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
  WITH this0
  DETACH DELETE this0
} IN TRANSACTIONS ON ERROR RETRY THEN CONTINUE"
`);
            });

            test("Call in transaction on error retry seconds then", () => {
                const query = Cypher.utils.concat(
                    new Cypher.Match(new Cypher.Pattern(node)),
                    new Cypher.Call(subquery).inTransactions({
                        retry: 10,
                        onError: "break",
                    })
                );

                const queryResult = query.build();
                expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
  WITH this0
  DETACH DELETE this0
} IN TRANSACTIONS ON ERROR RETRY FOR 10 SECONDS THEN BREAK"
`);
            });

            test("Call in transaction on error  set to false", () => {
                const query = Cypher.utils.concat(
                    new Cypher.Match(new Cypher.Pattern(node)),
                    new Cypher.Call(subquery).inTransactions({
                        retry: false,
                    })
                );

                const queryResult = query.build();
                expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
  WITH this0
  DETACH DELETE this0
} IN TRANSACTIONS"
`);
            });

            test("Call in transaction on error  set to 0", () => {
                const query = Cypher.utils.concat(
                    new Cypher.Match(new Cypher.Pattern(node)),
                    new Cypher.Call(subquery).inTransactions({
                        retry: 0,
                    })
                );

                const queryResult = query.build();
                expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
  WITH this0
  DETACH DELETE this0
} IN TRANSACTIONS ON ERROR RETRY FOR 0 SECONDS"
`);
            });
        });

        test("Call in transaction on error continue", () => {
            const query = Cypher.utils.concat(
                new Cypher.Match(new Cypher.Pattern(node)),
                new Cypher.Call(subquery).inTransactions({
                    onError: "continue",
                })
            );

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
  WITH this0
  DETACH DELETE this0
} IN TRANSACTIONS ON ERROR CONTINUE"
`);
        });

        test("Call in transaction in rows and on error", () => {
            const node = new Cypher.Node();
            const deleteSubquery = new Cypher.With(node).detachDelete(node);

            const query = Cypher.utils.concat(
                new Cypher.Match(new Cypher.Pattern(node)),
                new Cypher.Call(deleteSubquery).inTransactions({
                    ofRows: 10,
                    onError: "fail",
                })
            );

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
  WITH this0
  DETACH DELETE this0
} IN TRANSACTIONS OF 10 ROWS ON ERROR FAIL"
`);
        });

        test("Call in concurrent transaction", () => {
            const node = new Cypher.Node();
            const deleteSubquery = new Cypher.With(node).detachDelete(node);

            const query = Cypher.utils.concat(
                new Cypher.Match(new Cypher.Pattern(node)),
                new Cypher.Call(deleteSubquery).inTransactions({
                    concurrentTransactions: 3,
                })
            );

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
  WITH this0
  DETACH DELETE this0
} IN 3 CONCURRENT TRANSACTIONS"
`);
        });

        test("Call in concurrent transaction of rows and error", () => {
            const node = new Cypher.Node();
            const deleteSubquery = new Cypher.With(node).detachDelete(node);

            const query = Cypher.utils.concat(
                new Cypher.Match(new Cypher.Pattern(node)),
                new Cypher.Call(deleteSubquery).inTransactions({
                    ofRows: 10,
                    onError: "fail",
                    concurrentTransactions: 5,
                })
            );

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
  WITH this0
  DETACH DELETE this0
} IN 5 CONCURRENT TRANSACTIONS OF 10 ROWS ON ERROR FAIL"
`);
        });

        test("In transaction with all options", () => {
            const query = Cypher.utils.concat(
                new Cypher.Match(new Cypher.Pattern(node)),
                new Cypher.Call(subquery).inTransactions({
                    ofRows: 10,
                    onError: "break",
                    concurrentTransactions: 2,
                    retry: 5,
                })
            );

            const queryResult = query.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0)
CALL {
  WITH this0
  DETACH DELETE this0
} IN 2 CONCURRENT TRANSACTIONS OF 10 ROWS ON ERROR RETRY FOR 5 SECONDS THEN BREAK"
`);
        });
    });

    describe("Variable scope clause", () => {
        test("Call with variable scope", () => {
            const movieNode = new Cypher.Node();
            const actorNode = new Cypher.Node();

            const match = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] })).match(
                new Cypher.Pattern(actorNode, { labels: ["Actor"] })
            );
            const clause = new Cypher.Call(new Cypher.Create(new Cypher.Pattern(movieNode).related().to(actorNode)), [
                movieNode,
                actorNode,
            ]).return(movieNode);

            const queryResult = Cypher.utils.concat(match, clause).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
MATCH (this1:Actor)
CALL (this0, this1) {
  CREATE (this0)-[]->(this1)
}
RETURN this0"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Call with empty variable scope", () => {
            const movieNode = new Cypher.Node();
            const actorNode = new Cypher.Node();

            const clause = new Cypher.Call(
                new Cypher.Create(new Cypher.Pattern(movieNode).related().to(actorNode)),
                []
            ).return(movieNode);

            const queryResult = clause.build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"CALL () {
  CREATE (this0)-[]->(this1)
}
RETURN this0"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        test("Call with * variable scope", () => {
            const movieNode = new Cypher.Node();
            const actorNode = new Cypher.Node();

            const match = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] })).match(
                new Cypher.Pattern(actorNode, { labels: ["Actor"] })
            );
            const clause = new Cypher.Call(
                new Cypher.Create(new Cypher.Pattern(movieNode).related().to(actorNode)),
                "*"
            ).return(movieNode);

            const queryResult = Cypher.utils.concat(match, clause).build();
            expect(queryResult.cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
MATCH (this1:Actor)
CALL (*) {
  CREATE (this0)-[]->(this1)
}
RETURN this0"
`);
            expect(queryResult.params).toMatchInlineSnapshot(`{}`);
        });

        describe("Optional Call", () => {
            test("Wraps query inside Call with optional method", () => {
                const idParam = new Cypher.Param("my-id");
                const movieNode = new Cypher.Node();

                const createQuery = new Cypher.Create(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
                    .set([movieNode.property("id"), idParam])
                    .return(movieNode);
                const queryResult = new Cypher.Call(createQuery).optional().build();
                expect(queryResult.cypher).toMatchInlineSnapshot(`
"OPTIONAL CALL {
  CREATE (this0:Movie)
  SET this0.id = $param0
  RETURN this0
}"
`);
                expect(queryResult.params).toMatchInlineSnapshot(`
                    {
                      "param0": "my-id",
                    }
                `);
            });

            test("Wraps query inside OptionalCall", () => {
                const idParam = new Cypher.Param("my-id");
                const movieNode = new Cypher.Node();

                const createQuery = new Cypher.Create(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
                    .set([movieNode.property("id"), idParam])
                    .return(movieNode);
                const queryResult = new Cypher.OptionalCall(createQuery).build();
                expect(queryResult.cypher).toMatchInlineSnapshot(`
"OPTIONAL CALL {
  CREATE (this0:Movie)
  SET this0.id = $param0
  RETURN this0
}"
`);
                expect(queryResult.params).toMatchInlineSnapshot(`
                    {
                      "param0": "my-id",
                    }
                `);
            });
        });
    });

    test("Call followed by Order By", () => {
        const idParam = new Cypher.Param("my-id");
        const movieNode = new Cypher.Node();

        const createQuery = new Cypher.Create(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
            .set([movieNode.property("id"), idParam])
            .return(movieNode);
        const queryResult = new Cypher.Call(createQuery).orderBy(movieNode).skip(10).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`
"CALL {
  CREATE (this0:Movie)
  SET this0.id = $param0
  RETURN this0
}
ORDER BY this0 ASC
SKIP 10"
`);
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": "my-id",
            }
        `);
    });
});
