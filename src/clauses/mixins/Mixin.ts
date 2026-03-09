/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { Clause } from "../../clauses/Clause.js";
import { CypherASTNode } from "../../CypherASTNode.js";

/**
 * Superclass of all mixins in CypherBuilder
 */
export abstract class Mixin extends CypherASTNode {}

export abstract class MixinClause extends Clause {}
