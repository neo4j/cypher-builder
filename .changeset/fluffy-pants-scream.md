---
"@neo4j/cypher-builder": minor
---

Add support for `OPTIONAL CALL`:

```js
new Cypher.OptionalCall(subquery);
```

Alternatively

```js
new Cypher.Call(subquery).optional();
```

To generate the following Cypher:

```cypher
OPTIONAL CALL {
    // Subquery
}
```
