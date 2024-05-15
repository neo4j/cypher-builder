---
"@neo4j/cypher-builder": minor
---

Add support for FINISH clauses:

```js
new Cypher.Finish()

new Cypher.Match(...).finish()
new Cypher.Create(...).finish()
new Cypher.Merge(...).finish()
```
