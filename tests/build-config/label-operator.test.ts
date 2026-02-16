/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../src";
import { TestClause } from "../../src/utils/TestClause";

describe.each([":", "&"] as const)("Config.labelOperator", (labelOperator) => {
    test("Pattern", () => {
        const node = new Cypher.Node();
        const query = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie", "Film"] }));

        const queryResult = new TestClause(query).build({
            labelOperator,
        });

        expect(queryResult.cypher).toBe(`MATCH (this0:Movie${labelOperator}Film)`);
    });

    test("hasLabel", () => {
        const node = new Cypher.Node();
        const query = new Cypher.Match(new Cypher.Pattern(node, { labels: ["Movie"] })).where(
            node.hasLabels("Movie", "Film")
        );

        const queryResult = new TestClause(query).build({
            labelOperator,
        });

        expect(queryResult.cypher).toBe(`MATCH (this0:Movie)
WHERE this0:Movie${labelOperator}Film`);
    });
});
