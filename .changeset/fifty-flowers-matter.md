---
"@neo4j/cypher-builder": patch
---

Deprecate `Foreach` extra constructor parameters in favor of methods `in` and `do`:

_Before_:

```js
new Cypher.Foreach(variable, list, createMovie);
```

_Now_:

```js
new Cypher.Foreach(variable).in(list).do(createMovie);
```
