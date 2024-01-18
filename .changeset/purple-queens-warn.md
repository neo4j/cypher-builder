---
"@neo4j/cypher-builder": minor
---

Add support for type predicate expressions with the functions `Cypher.isType` and `Cypher.isNotType`:

```ts
const variable = new Cypher.Variable();
const unwindClause = new Cypher.Unwind([new Cypher.Literal([42, true, "abc", null]), variable]).return(
    variable,
    Cypher.isType(variable, Cypher.TYPE.INTEGER)
);
```

```cypher
UNWIND [42, true, \\"abc\\", NULL] AS var0
RETURN var0, var0 IS :: INTEGER
```
