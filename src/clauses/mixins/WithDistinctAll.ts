/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { Mixin } from "./Mixin.js";

enum ProjectionMode {
    ALL,
    DISTINCT,
}

export abstract class WithDistinctAll extends Mixin {
    private projectionMode: ProjectionMode | undefined;

    public distinct(): this {
        this.projectionMode = ProjectionMode.DISTINCT;
        return this;
    }

    /** Explicitly project all values bound to a variable
     * @since Neo4j 2025.06
     */
    public all(): this {
        this.projectionMode = ProjectionMode.ALL;
        return this;
    }

    protected projectionModeStr(): string {
        switch (this.projectionMode) {
            case ProjectionMode.ALL:
                return " ALL";
            case ProjectionMode.DISTINCT:
                return " DISTINCT";
            default:
                return "";
        }
    }
}
