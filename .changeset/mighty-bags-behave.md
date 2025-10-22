---
"@neo4j/cypher-builder": minor
---

Add support for range operator (`[ .. ]`) in `Cypher.List`, `PropertyRef.range` and using `Cypher.listRange`:

```js
new Cypher.Variable().property("prop").range(1, -1); // var0["prop"][1..-1]
new Cypher.List([1, 2, 3, 4]).range(1, -1); // [1, 2, 3, 4][1..-1]
Cypher.listRange(expr, 2, -1); // expr[2..-1]
```
