---
"@neo4j/cypher-builder": major
---

Remove all apoc functions and procedures:

- `apoc.util.validate`
- `apoc.util.validatePredicate`
- `apoc.date.convertFormat`
- `apoc.cypher.runFirstColumnMany`
- `apoc.cypher.runFirstColumnSingle`

In order to use apoc methods, create a custom function or procedure. For example:

```js
function validate(
    predicate: Predicate,
    message: string,
    params: List | Literal | Map
): VoidCypherProcedure {
    return new VoidCypherProcedure("apoc.util.validate", [predicate,  new Literal(message), params]);
}
```

```js
function validatePredicate(predicate: Predicate, message: string): CypherFunction {
    return new CypherFunction("apoc.util.validatePredicate", [predicate, new Literal(message), new Literal([0])]);
}

```
