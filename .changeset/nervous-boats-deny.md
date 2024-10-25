---
"@neo4j/cypher-builder": patch
---

Deprecate using a `Node` as a constructor of `Cypher.PatternComprehension`:

```js
const node = new Cypher.Node();
const comprehension = new Cypher.PatternComprehension(node);
```
