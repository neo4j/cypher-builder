/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../src";

describe("Extra Params", () => {
    test("Adding extra params to build options", () => {
        const movieNode = new Cypher.Node();
        const pattern = new Cypher.Pattern(movieNode, { labels: ["Movie"] });

        const matchQuery = new Cypher.Match(pattern)
            .where(movieNode, {
                title: new Cypher.Param("The Matrix"),
            })
            .return(movieNode.property("title"));

        const { cypher, params } = matchQuery.build({
            extraParams: {
                myExtraParam1: "Extra Param",
            },
        });

        expect(cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            WHERE this0.title = $param0
            RETURN this0.title"
        `);
        expect(params).toMatchInlineSnapshot(`
{
  "myExtraParam1": "Extra Param",
  "param0": "The Matrix",
}
`);
    });

    test("Adding extra params with conflict to build options", () => {
        const movieNode = new Cypher.Node();
        const pattern = new Cypher.Pattern(movieNode, { labels: ["Movie"] });

        const matchQuery = new Cypher.Match(pattern)
            .where(movieNode, {
                title: new Cypher.Param("The Matrix"),
            })
            .return(movieNode.property("title"));

        const { cypher, params } = matchQuery.build({
            extraParams: {
                param0: "Extra Param",
            },
        });

        expect(cypher).toMatchInlineSnapshot(`
            "MATCH (this0:Movie)
            WHERE this0.title = $param0
            RETURN this0.title"
        `);
        expect(params).toMatchInlineSnapshot(`
{
  "param0": "Extra Param",
}
`);
    });
});
