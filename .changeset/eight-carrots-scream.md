---
"@neo4j/cypher-builder": patch
---

Refactors mixins.
Due to this, multiple top-level clauses nested in the same clause will fail:

The following is not supported;

```javascript
const match = new Cypher.Match();

match.with();
match.return();
```

In favor of the following:

```javascript
const match = new Cypher.Match();

match.with().return();
```
