/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { NamedReference } from "./Variable";
import { Variable } from "./Variable";

/** Reference to a path variable
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/patterns | Cypher Documentation}
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
