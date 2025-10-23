---
"@neo4j/cypher-builder": major
---

Remove `.importWith` from `Call` clauses in favor of constructor options

_Before_

```js
const clause = new Cypher.Call(nestedClause).importWith(movieNode, actorNode);
```

```cypher
CALL {
    WITH var0, var1
    // Nested clause
}
```

_After_

```js
const clause = new Cypher.Call(nestedClause, [movieNode, actorNode]);
```

```cypher
CALL (var0, var1){
    // Nested clause
}
```
