/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import Cypher from "..";
import { TestClause } from "../utils/TestClause";

describe("Variable", () => {
    test("Creates multiple variables", () => {
        const variable1 = new Cypher.Variable();
        const variable2 = new Cypher.Variable();

        expect(new TestClause(variable1, variable2).build().cypher).toMatchInlineSnapshot(`"var0var1"`);
    });

    test("sets an index to a variable", () => {
        const variableIndex = new Cypher.Variable().index(3);

        expect(new TestClause(variableIndex).build().cypher).toMatchInlineSnapshot(`"var0[3]"`);
    });

    test("access a property of a variable", () => {
        const variableProp = new Cypher.Variable().property("title");

        expect(new TestClause(variableProp).build().cypher).toMatchInlineSnapshot(`"var0.title"`);
    });

    test("access nested properties of a variable", () => {
        const variableProp = new Cypher.Variable().property("title", "uppercase");

        expect(new TestClause(variableProp).build().cypher).toMatchInlineSnapshot(`"var0.title.uppercase"`);
    });

    test("access a property through an expression", () => {
        const variableProp = new Cypher.Variable().property(
            Cypher.plus(new Cypher.Param("foo"), new Cypher.Literal("bar"))
        );

        expect(new TestClause(variableProp).build().cypher).toMatchInlineSnapshot(`"var0[($param0 + \\"bar\\")]"`);
    });

    test("does not escape named variable with valid name", () => {
        const variableProp = new Cypher.NamedVariable("MyVariable").property("title");

        expect(new TestClause(variableProp).build().cypher).toMatchInlineSnapshot(`"MyVariable.title"`);
    });

    test("escapes named variable", () => {
        const variableProp = new Cypher.NamedVariable("My Variable").property("my title");

        expect(new TestClause(variableProp).build().cypher).toMatchInlineSnapshot(`"\`My Variable\`.\`my title\`"`);
    });

    test.each(["where", "is", "contains", "in", "WHERE", "Is"])(
        "escapes named variable with reserved keyword: %s",
        (keyword) => {
            const variableProp = new Cypher.NamedVariable(keyword).property("title");

            expect(new TestClause(variableProp).build().cypher).toEqual(`\`${keyword}\`.title`);
        }
    );
});
