/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Cypher from "../src";

const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");

describe("Console.log", () => {
    test("Console.log on a clause", () => {
        const releasedParam = new Cypher.Param(1999);

        const movieNode = new Cypher.Node();

        const query = new Cypher.Create(
            new Cypher.Pattern(movieNode, {
                labels: ["Movie"],
            })
        ).set(
            [movieNode.property("released"), releasedParam] // Explicitly defines the node property
        );

        expect(`${query}`).toMatchInlineSnapshot(`
            "<Clause Create> \\"\\"\\"
                CREATE (this0:Movie)
                SET
                    this0.released = $param0
            \\"\\"\\""
        `);
        expect(query.toString()).toMatchInlineSnapshot(`
            "<Clause Create> \\"\\"\\"
                CREATE (this0:Movie)
                SET
                    this0.released = $param0
            \\"\\"\\""
        `);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((query as any)[customInspectSymbol]()).toMatchInlineSnapshot(`
            "<Clause Create> \\"\\"\\"
                CREATE (this0:Movie)
                SET
                    this0.released = $param0
            \\"\\"\\""
        `);
    });

    test("console.log on a pattern", () => {
        const a = new Cypher.Node();

        const pattern = new Cypher.Pattern(a).related().to();

        expect(`${pattern}`).toMatchInlineSnapshot(`
"<Pattern> \\"\\"\\"
    (this0)-[]->()
\\"\\"\\""
`);
        expect(pattern.toString()).toMatchInlineSnapshot(`
"<Pattern> \\"\\"\\"
    (this0)-[]->()
\\"\\"\\""
`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((pattern as any)[customInspectSymbol]()).toMatchInlineSnapshot(`
"<Pattern> \\"\\"\\"
    (this0)-[]->()
\\"\\"\\""
`);
    });

    test("console.log on a pattern element", () => {
        const a = new Cypher.Node();

        const pattern = new Cypher.Pattern(a).related();

        expect(`${pattern}`).toMatchInlineSnapshot(`
"<PartialPattern> \\"\\"\\"
    (this0)-[]->
\\"\\"\\""
`);
        expect(pattern.toString()).toMatchInlineSnapshot(`
"<PartialPattern> \\"\\"\\"
    (this0)-[]->
\\"\\"\\""
`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((pattern as any)[customInspectSymbol]()).toMatchInlineSnapshot(`
"<PartialPattern> \\"\\"\\"
    (this0)-[]->
\\"\\"\\""
`);
    });

    test("Console.log on a clause with errors", () => {
        const query = new Cypher.Create(
            new Cypher.Pattern(new Cypher.Node(), {
                labels: ["Movie"],
            })
        ).return(
            new Cypher.Raw(() => {
                throw new Error("This clause fails to compile");
            })
        );

        expect(`${query}`).toMatchInlineSnapshot(`
"<Clause Return> \\"\\"\\"
Error: This clause fails to compile
\\"\\"\\""
`);
        expect(query.toString()).toMatchInlineSnapshot(`
"<Clause Return> \\"\\"\\"
Error: This clause fails to compile
\\"\\"\\""
`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((query as any)[customInspectSymbol]()).toMatchInlineSnapshot(`
"<Clause Return> \\"\\"\\"
Error: This clause fails to compile
\\"\\"\\""
`);
    });
    test("Console.log on a clause that throws a string", () => {
        const query = new Cypher.Create(
            new Cypher.Pattern(new Cypher.Node(), {
                labels: ["Movie"],
            })
        ).return(
            new Cypher.Raw(() => {
                // eslint-disable-next-line @typescript-eslint/only-throw-error
                throw "this is not an error";
            })
        );

        expect(`${query}`).toMatchInlineSnapshot(`
"<Clause Return> \\"\\"\\"
Error: this is not an error
\\"\\"\\""
`);
        expect(query.toString()).toMatchInlineSnapshot(`
"<Clause Return> \\"\\"\\"
Error: this is not an error
\\"\\"\\""
`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((query as any)[customInspectSymbol]()).toMatchInlineSnapshot(`
"<Clause Return> \\"\\"\\"
Error: this is not an error
\\"\\"\\""
`);
    });
});
