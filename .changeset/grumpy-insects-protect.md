---
"@neo4j/cypher-builder": patch
---

Add support for "\*" parameter in MapProjection:

```js
new Cypher.MapProjection(new Cypher.Variable(), "*");
```

```cypher
var0 { .* }
```
