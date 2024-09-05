---
"@neo4j/cypher-builder": minor
---

Add support for variable scope in CALL:

```js
const movieNode = new Cypher.Node();
const actorNode = new Cypher.Node();

const clause = new Cypher.Call(new Cypher.Create(new Cypher.Pattern(movieNode).related().to(actorNode)), [
    movieNode,
    actorNode,
]);
```

```cypher
CALL (this0, this1) {
    CREATE (this0)-[this2]->(this1)
}
```
