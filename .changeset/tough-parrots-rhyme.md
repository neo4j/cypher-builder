---
"@neo4j/cypher-builder": patch
---

Support for passing `undefined` to `.where`:

```ts
const n = new Cypher.Node();
new Cypher.Match(n).where(undefined).return(n);
```

This will generate the following Cypher:

```
MATCH(n)
RETURN n
```

Note that the `WHERE` clause is omitted if the predicate is `undefined`
