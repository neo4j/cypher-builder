---
"@neo4j/cypher-builder": patch
---

Support for a single value in `Cypher.minus` operator:

```js
Cypher.minus(var1, var2); // var1 - var2
Cypher.minus(var1); // -var1
```
