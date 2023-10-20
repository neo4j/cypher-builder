---
"@neo4j/cypher-builder": patch
---

Refactors mixins.
Due to this, multiple top-level clauses nested in the same clause will explicitly fail, instead of silent failing:

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
