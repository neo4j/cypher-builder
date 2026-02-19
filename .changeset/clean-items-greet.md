---
"@neo4j/cypher-builder": major
---

Remove second parameter of `ListComprehension` in favor of `.in`

_Before_

```js
new Cypher.ListComprehension(variable, new Cypher.Literal([1, 2]));
```

_After_

```js
new Cypher.ListComprehension(variable).in(new Cypher.Literal([1, 2]));
```

In both cases, the same comprehension will be generated:

```cypher
[var0 IN [1, 2]]
```
