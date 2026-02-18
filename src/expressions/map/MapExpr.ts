/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import type { CypherEnvironment } from "../../Environment";
import type { CypherCompilable, Expr } from "../../types";
import { serializeMap } from "../../utils/serialize-map";

/** Represents a Map
 * @see {@link https://neo4j.com/docs/cypher-manual/current/syntax/maps/ | Cypher Documentation}
 * @group Maps
 */
export class MapExpr implements CypherCompilable {
    private readonly map = new Map<string, Expr>();

    constructor(value: Record<string, Expr> = {}) {
        this.set(value);
    }

    public get size(): number {
        return this.map.size;
    }

    public set(key: string, value: Expr): void;
    public set(values: Record<string, Expr>): void;
    public set(keyOrValues: Record<string, Expr> | string, value?: Expr): void {
        if (typeof keyOrValues === "string") {
            this.setField(keyOrValues, value);
        } else {
            for (const [key, value] of Object.entries(keyOrValues)) {
                this.setField(key, value);
            }
        }
    }

    private setField(key: string, value: Expr | undefined): void {
        if (!value) throw new Error(`Missing value on map key ${key}`);
        this.map.set(key, value);
    }

    /**
     *  @internal
     */
    public getCypher(env: CypherEnvironment): string {
        return serializeMap(env, this.map);
    }
}
