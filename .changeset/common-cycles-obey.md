---
"@neo4j/cypher-builder": major
---

Remove support for patterns in size.

_No longer supported_

```js
Cypher.size(new Cypher.Pattern(node));
```

Use `new Cypher.Count(pattern)` instead.
