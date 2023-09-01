---
"@neo4j/cypher-builder": minor
---

Deprecates `Cypher.utils.compileCypher` and `.getCypher` in favor of `env.compile`:

Previously:

```js
new Cypher.RawCypher((env) => {
    const myVar = new Cypher.Variable();
    return myVar.getCypher(env);
});
```

Or

```js
new Cypher.RawCypher((env) => {
    const myVar = new Cypher.Variable();
    return Cypher.utils.compileCypher(myVar, env);
});
```

Now:

```js
new Cypher.RawCypher((env) => {
    const myVar = new Cypher.Variable();
    return env.compile(myVar);
});
```
