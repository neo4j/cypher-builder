---
"@neo4j/cypher-builder": patch
---

Support for chained `.yield`:

```ts
const customProcedure = new Cypher.Procedure("customProcedure", []).yield("result1").yield(["result2", "aliased"]);
```

is equivalent to:

```ts
const customProcedure = new Cypher.Procedure("customProcedure", []).yield("result1", ["result2", "aliased"]);
```

and results in the Cypher:

```cypher
CALL customProcedure() YIELD result1, result2 AS aliased
```
