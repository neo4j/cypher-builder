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

import type { CypherEnvironment } from "../../Environment";
import type { Path } from "../../references/Path";
import { compileCypherIfExists } from "../../utils/compile-cypher-if-exists";
import { Mixin } from "./Mixin";

export abstract class WithPathAssign extends Mixin {
    private pathVariable: Path | undefined;

    /** Add a path assignment to the pattern
     * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/syntax/patterns/#cypher-pattern-path-variables)
     * @deprecated Use `Pattern.assignTo` instead
     */
    public assignToPath(path: Path): this {
        this.pathVariable = path;
        return this;
    }

    protected compilePath(env: CypherEnvironment): string {
        return compileCypherIfExists(this.pathVariable, env, {
            suffix: " = ",
        });
    }
}
