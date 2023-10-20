---
"@neo4j/cypher-builder": patch
---

Deprecates using `With.with` when nested with already exists in favour of `addColumn`:

```js
const withQuery = new Cypher.With(node);

withQuery.with(node2);
withQuery.with("*");
```

Instead, it should be:

```js
const withQuery = new Cypher.With(node);

const nestedWith = withQuery.with(node2);
nestedWith.addColumn("*");
```
