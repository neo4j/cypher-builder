---
"@neo4j/cypher-builder": major
---

Escape literal strings if they contain invalid characters:

```js
new Cypher.Literal(`Hello "World"`);
```

Would get translated into the following Cypher:

```cypher
"Hello \"World\""
```
