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

import { asArray } from "./as-array";

describe("asArray", () => {
    test("get array from array", () => {
        const result = asArray([1, 2]);
        expect(result).toEqual([1, 2]);
    });

    test("get array from null", () => {
        const result = asArray(null);
        expect(result).toEqual([]);
    });

    test("get array from undefined", () => {
        const result = asArray(undefined);
        expect(result).toEqual([]);
    });

    test("get array from object", () => {
        const result = asArray({});
        expect(result).toEqual([{}]);
    });

    test("get array from number", () => {
        const result = asArray(3);
        expect(result).toEqual([3]);
    });
});
