/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { HasLabel } from "../expressions/HasLabel.js";
import type { LabelExpr } from "../expressions/labels/label-expressions.js";
import type { NamedReference } from "./Variable.js";
import { Variable } from "./Variable.js";

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
