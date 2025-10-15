---
"@neo4j/cypher-builder": minor
---

Support for index operator on arbitrary expressions using `listIndex`

```js
Cypher.listIndex(Cypher.collect(new Cypher.Variable()), 2);
```

```cypher
collect(var0)[2]
```
