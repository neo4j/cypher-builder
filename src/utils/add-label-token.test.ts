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

import { addLabelToken } from "./add-label-token";

describe.each([":", "&"] as const)("addLabelToken", (operator) => {
    test("addLabelToken without labels using operator %s", () => {
        const result = addLabelToken(operator);
        expect(result).toBe("");
    });

    test("addLabelToken with a single label using operator %s", () => {
        const result = addLabelToken(operator, "Movie");
        expect(result).toBe(":Movie");
    });

    test("addLabelToken with two labels using operator %s", () => {
        const result = addLabelToken(operator, "Movie", "Film");
        expect(result).toBe(`:Movie${operator}Film`);
    });

    test("addLabelToken with multiple labels using operator %s", () => {
        const result = addLabelToken(operator, "Movie", "Film", "Video");
        expect(result).toBe(`:Movie${operator}Film${operator}Video`);
    });
});
