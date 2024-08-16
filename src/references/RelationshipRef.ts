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

import { HasLabel } from "../../HasLabel";
import type { LabelExpr } from "../expressions/labels/label-expressions";
import type { NamedReference } from "./Variable";
import { Variable } from "./Variable";

/** Reference to a relationship property
 * @group Variables
 */
export class RelationshipRef extends Variable {
    constructor() {
        super();
        this.prefix = "this";
    }

    public hasType(label: string | LabelExpr): HasLabel {
        if (typeof label === "string") {
            return new HasLabel(this, [label]);
        } else {
            return new HasLabel(this, label);
        }
    }
}

/** Represents a relationship reference with a given name
 * @group Variables
 */
export class NamedRelationship extends RelationshipRef implements NamedReference {
    public readonly id: string;

    constructor(id: string) {
        super();
        this.id = id;
    }

    public get name(): string {
        return this.id;
    }
}
