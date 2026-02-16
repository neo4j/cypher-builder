/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 */

import { Where } from "../../clauses/sub-clauses/Where";
import type { CypherEnvironment } from "../../Environment";
import type { Pattern } from "../../pattern/Pattern";
import type { Variable } from "../../references/Variable";
import type { Expr, Predicate } from "../../types";
import { compileCypherIfExists } from "../../utils/compile-cypher-if-exists";
import { CypherFunction } from "./CypherFunctions";

/** Represents a predicate function that can be used in a WHERE statement
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/predicate/ | Cypher Documentation}
 * @group Functions
 * @category Predicate
 */
export class PredicateFunction extends CypherFunction {}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/predicate/#functions-all | Cypher Documentation}
 * @group Functions
 * @category Predicate
 */
export function all(variable: Variable, listExpr: Expr, whereFilter: Predicate): PredicateFunction {
    return new ListPredicateFunction("all", variable, listExpr, whereFilter);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/predicate/#functions-any | Cypher Documentation}
 * @group Functions
 * @category Predicate
 */
export function any(variable: Variable, listExpr: Expr, whereFilter: Predicate): PredicateFunction {
    return new ListPredicateFunction("any", variable, listExpr, whereFilter);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/predicate/#functions-exists | Cypher Documentation}
 * @group Functions
 * @category Predicate
 */
export function exists(pattern: Pattern): PredicateFunction {
    return new ExistsFunction(pattern);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/predicate/#functions-isempty | Cypher Documentation}
 * @group Functions
 * @category Predicate
 */
export function isEmpty(list: Expr): PredicateFunction {
    return new PredicateFunction("isEmpty", [list]);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/predicate/#functions-none | Cypher Documentation}
 * @group Functions
 * @category Predicate
 */
export function none(variable: Variable, listExpr: Expr, whereFilter: Predicate): PredicateFunction {
    return new ListPredicateFunction("none", variable, listExpr, whereFilter);
}

/**
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/predicate/#functions-single | Cypher Documentation}
 * @group Functions
 * @category Predicate
 */
export function single(variable: Variable, listExpr: Expr, whereFilter: Predicate): PredicateFunction {
    return new ListPredicateFunction("single", variable, listExpr, whereFilter);
}

class ExistsFunction extends PredicateFunction {
    private readonly pattern: Pattern;

    constructor(pattern: Pattern) {
        super("exists");
        this.pattern = pattern;
    }

    getCypher(env: CypherEnvironment): string {
        const patternStr = this.pattern.getCypher(env);

        return `exists(${patternStr})`;
    }
}

/** Predicate function that uses a list comprehension "var IN list WHERE .." */
class ListPredicateFunction extends PredicateFunction {
    private readonly variable: Variable;
    private readonly listExpr: Expr;
    private readonly whereSubClause: Where;

    constructor(name: string, variable: Variable, listExpr: Expr, whereFilter: Predicate) {
        super(name);
        this.variable = variable;
        this.listExpr = listExpr;

        this.whereSubClause = new Where(this, whereFilter);
    }

    getCypher(env: CypherEnvironment): string {
        const whereStr = compileCypherIfExists(this.whereSubClause, env, { prefix: " " });
        const listExprStr = this.listExpr.getCypher(env);
        const varCypher = this.variable.getCypher(env);

        return `${this.name}(${varCypher} IN ${listExprStr}${whereStr})`;
    }
}
