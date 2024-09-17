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
import { escapeLiteralString } from "./escape";

describe("escaping", () => {
    describe.each(["escapeVariable", "escapeLabel", "escapeType", "escapeProperty"] as const)("utils.%s()", (func) => {
        test("Does not escape empty strings", () => {
            expect(Cypher.utils[func]("")).toBe("");
        });

        test.each(["this", "this0", "_var", "this_0"])("Does not escape '%s'", (value) => {
            expect(Cypher.utils[func](value)).toBe(value);
        });

        test.each([
            ["my var", "`my var`"],
            ["my `var", "`my ``var`"],
            ["0", "`0`"],
            ["0this", "`0this`"],
        ])("Escape '%s'", (original, expected) => {
            expect(Cypher.utils[func](original)).toBe(expected);
        });
    });

    describe("escapeLiteralString", () => {
        test("Does not escape empty strings", () => {
            expect(escapeLiteralString("")).toBe("");
        });

        test.each([[`my "var"`, `my \\"var\\"`, `my \\"var`, `my \\\\"var`]])("Escape '%s'", (original, expected) => {
            expect(escapeLiteralString(original)).toBe(expected);
        });

        test.each(["this", "_var", "hello` dsa"])("Does not escape '%s'", (value) => {
            expect(escapeLiteralString(value)).toBe(value);
        });
    });
});
