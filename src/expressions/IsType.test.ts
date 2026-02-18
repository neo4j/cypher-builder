/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "..";

describe("IsType", () => {
    test("UNWIND return isType", () => {
        const variable = new Cypher.Variable();
        const unwindClause = new Cypher.Unwind([new Cypher.Literal([42, true, "abc", null]), variable]).return(
            variable,
            Cypher.isType(variable, Cypher.TYPE.INTEGER)
        );

        const { cypher, params } = unwindClause.build();

        expect(cypher).toMatchInlineSnapshot(`
"UNWIND [42, true, 'abc', NULL] AS var0
RETURN var0, var0 IS :: INTEGER"
`);
        expect(params).toMatchInlineSnapshot(`{}`);
    });

    test.each([
        Cypher.TYPE.ANY,
        Cypher.TYPE.BOOLEAN,
        Cypher.TYPE.DATE,
        Cypher.TYPE.DURATION,
        Cypher.TYPE.FLOAT,
        Cypher.TYPE.INTEGER,
        Cypher.TYPE.LOCAL_DATETIME,
        Cypher.TYPE.LOCAL_TIME,
        Cypher.TYPE.MAP,
        Cypher.TYPE.NODE,
        Cypher.TYPE.NOTHING,
        Cypher.TYPE.NULL,
        Cypher.TYPE.PATH,
        Cypher.TYPE.POINT,
        Cypher.TYPE.PROPERTY_VALUE,
        Cypher.TYPE.RELATIONSHIP,
        Cypher.TYPE.STRING,
        Cypher.TYPE.ZONED_DATETIME,
        Cypher.TYPE.ZONED_TIME,
        Cypher.TYPE.TIMESTAMP_WITHOUT_TIME_ZONE,
        Cypher.TYPE.TIME_WITHOUT_TIME_ZONE,
        Cypher.TYPE.TIMESTAMP_WITH_TIME_ZONE,
        Cypher.TYPE.TIME_WITH_TIME_ZONE,
    ] as const)("isType '%s'", (type) => {
        const movie = new Cypher.Node();
        const matchClause = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["Movie"] }))
            .where(Cypher.isType(movie.property("title"), type))
            .return(movie);

        const { cypher } = matchClause.build();

        expect(cypher).toEqual(`MATCH (this0:Movie)
WHERE this0.title IS :: ${type}
RETURN this0`);
    });

    test("isType 'List<STRING>'", () => {
        const movie = new Cypher.Node();
        const matchClause = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["Movie"] }))
            .where(Cypher.isType(movie.property("title"), Cypher.TYPE.list(Cypher.TYPE.STRING)))
            .return(movie);

        const { cypher } = matchClause.build();

        expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE this0.title IS :: LIST<STRING>
RETURN this0"
`);
    });

    test("isType 'List<List<STRING>>'", () => {
        const movie = new Cypher.Node();
        const matchClause = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["Movie"] }))
            .where(Cypher.isType(movie.property("title"), Cypher.TYPE.list(Cypher.TYPE.list(Cypher.TYPE.STRING))))
            .return(movie);

        const { cypher } = matchClause.build();

        expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE this0.title IS :: LIST<LIST<STRING>>
RETURN this0"
`);
    });

    test("isType with union type", () => {
        const movie = new Cypher.Node();
        const matchClause = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["Movie"] }))
            .where(Cypher.isType(movie.property("title"), [Cypher.TYPE.list(Cypher.TYPE.STRING), Cypher.TYPE.STRING]))
            .return(movie);

        const { cypher } = matchClause.build();

        expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE this0.title IS :: LIST<STRING> | STRING
RETURN this0"
`);
    });

    test("isType in NOT", () => {
        const movie = new Cypher.Node();
        const matchClause = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["Movie"] }))
            .where(Cypher.not(Cypher.isType(movie.property("title"), Cypher.TYPE.STRING)))
            .return(movie);

        const { cypher } = matchClause.build();

        expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE NOT (this0.title IS :: STRING)
RETURN this0"
`);
    });

    test("isNotType", () => {
        const movie = new Cypher.Node();
        const matchClause = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["Movie"] }))
            .where(Cypher.isNotType(movie.property("title"), Cypher.TYPE.STRING))
            .return(movie);

        const { cypher } = matchClause.build();

        expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE this0.title IS NOT :: STRING
RETURN this0"
`);
    });

    describe("notNull", () => {
        test("isType.notNull", () => {
            const movie = new Cypher.Node();
            const matchClause = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["Movie"] }))
                .where(Cypher.isType(movie.property("title"), Cypher.TYPE.STRING).notNull())
                .return(movie);

            const { cypher } = matchClause.build();

            expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE this0.title IS :: STRING NOT NULL
RETURN this0"
`);
        });

        test("isNotType.notNull", () => {
            const movie = new Cypher.Node();
            const matchClause = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["Movie"] }))
                .where(Cypher.isNotType(movie.property("title"), Cypher.TYPE.STRING).notNull())
                .return(movie);

            const { cypher } = matchClause.build();

            expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE this0.title IS NOT :: STRING NOT NULL
RETURN this0"
`);
        });

        test("isType.notNull with union type", () => {
            const movie = new Cypher.Node();
            const matchClause = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["Movie"] }))
                .where(Cypher.isType(movie.property("title"), [Cypher.TYPE.STRING, Cypher.TYPE.BOOLEAN]).notNull())
                .return(movie);

            const { cypher } = matchClause.build();

            expect(cypher).toMatchInlineSnapshot(`
"MATCH (this0:Movie)
WHERE this0.title IS :: STRING NOT NULL | BOOLEAN NOT NULL
RETURN this0"
`);
        });

        test("isType with union type", () => {
            const movie = new Cypher.Node();
            const matchClause = new Cypher.Match(new Cypher.Pattern(movie, { labels: ["Movie"] }))
                .where(
                    Cypher.isType(movie.property("title"), [
                        Cypher.TYPE.list([Cypher.TYPE.STRING, Cypher.TYPE.FLOAT]).notNull(),
                        Cypher.TYPE.STRING,
                    ])
                )
                .return(movie);

            const { cypher } = matchClause.build();

            expect(cypher).toMatchInlineSnapshot(`
    "MATCH (this0:Movie)
    WHERE this0.title IS :: LIST<STRING NOT NULL | FLOAT NOT NULL> | STRING
    RETURN this0"
    `);
        });
    });
});
