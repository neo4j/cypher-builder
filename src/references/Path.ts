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

import type { NamedReference } from "./Variable";
import { Variable } from "./Variable";

/** Reference to a path variable
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/patterns)
 * @group Variables
 */
export class PathVariable extends Variable {
    constructor() {
        super();
        this.prefix = "p";
    }
}

/** For compatibility reasons, represents a path as a variable with the given name
 *  @group Variables
 */
export class NamedPathVariable extends PathVariable implements NamedReference {
    public readonly id: string;

    constructor(name: string) {
        super();
        this.id = name;
        this.prefix = "";
    }
}
