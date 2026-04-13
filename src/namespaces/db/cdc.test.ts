/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "../../index";

describe("db.cdc procedures", () => {
    test("cdc.current", () => {
        const query = Cypher.db.cdc.current();
        const { cypher } = query.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL db.cdc.current()"`);
    });

    test("cdc.current with yield", () => {
        const query = Cypher.db.cdc.current().yield("id");
        const { cypher } = query.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL db.cdc.current() YIELD id"`);
    });
    test("cdc.earliest", () => {
        const query = Cypher.db.cdc.earliest();
        const { cypher } = query.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL db.cdc.earliest()"`);
    });

    test("cdc.earliest with yield", () => {
        const query = Cypher.db.cdc.earliest().yield("id");
        const { cypher } = query.build();

        expect(cypher).toMatchInlineSnapshot(`"CALL db.cdc.earliest() YIELD id"`);
    });

    describe("cdc.query", () => {
        const selector = new Cypher.Map({
            select: new Cypher.Literal("e"),
            operation: new Cypher.Literal("c"),
            changesTo: new Cypher.List([new Cypher.Literal("name"), new Cypher.Literal("title")]),
        });

        test("with string", () => {
            const query = Cypher.db.cdc.query("my-cursor");
            const { cypher } = query.build();

            expect(cypher).toMatchInlineSnapshot(`"CALL db.cdc.query('my-cursor', [])"`);
        });

        test("with literal", () => {
            const query = Cypher.db.cdc.query(new Cypher.Literal("my-cursor"));
            const { cypher } = query.build();

            expect(cypher).toMatchInlineSnapshot(`"CALL db.cdc.query('my-cursor', [])"`);
        });

        test("with selectors in array", () => {
            const query = Cypher.db.cdc.query("my-cursor", [selector]);

            const { cypher } = query.build();

            expect(cypher).toMatchInlineSnapshot(
                `"CALL db.cdc.query('my-cursor', [{select: 'e', operation: 'c', changesTo: ['name', 'title']}])"`
            );
        });
    });
});
