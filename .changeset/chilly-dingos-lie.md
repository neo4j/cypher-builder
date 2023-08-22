---
"@neo4j/cypher-builder": minor
---

Adds `compile` method to environment. To be used within a RawCypher clause instead of `.getCypher`:

Previously:

```js
new Cypher.RawCypher((env) => {
    const myVar = new Cypher.Variable();
    return myVar.getCypher(env);
});
```

Now:

```js
new Cypher.RawCypher((env) => {
    const myVar = new Cypher.Variable();
    return env.compile(myVar);
});
```
