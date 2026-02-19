/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { Expr } from "../index.js";
import { HasLabel } from "../expressions/HasLabel.js";
import type { LabelExpr } from "../expressions/labels/label-expressions.js";
import { DynamicLabel, Label } from "./Label.js";
import type { NamedReference } from "./Variable.js";
import { Variable } from "./Variable.js";

/** Represents a node reference
 * @group Variables
 */
export class NodeRef extends Variable {
    constructor() {
        super();
        this.prefix = "this";
    }

    public hasLabels(...labels: string[]): HasLabel {
        return new HasLabel(this, labels);
    }

    public hasLabel(label: string | LabelExpr): HasLabel {
        if (typeof label === "string") {
            return new HasLabel(this, [label]);
        } else {
            return new HasLabel(this, label);
        }
    }

    public label(label: string | Expr): Label {
        if (typeof label === "string") {
            return new Label(this, label);
        } else {
            return new DynamicLabel(this, label);
        }
    }
}

/** Represents a node reference with a given name
 * @group Variables
 */
export class NamedNode extends NodeRef implements NamedReference {
    public readonly id: string;

    constructor(id: string) {
        super();
        this.id = id;
    }

    public get name(): string {
        return this.id;
    }
}
