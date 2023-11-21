---
"@neo4j/cypher-builder": patch
---

Fix typings for boolean operators such as `Cypher.and`.

Until now, binary boolean operators (`and`, `or` and `xor`) could return undefined, this made it very easy for the typings to be incorrect, for example:

```ts
const predicates: Array<Cypher.Predicate> = [];
const result = Cypher.and(...predicates); // result is undefined, but its type is Cypher.Predicate
```

To solve this, binary operations will always return a Predicate, which will translate to an empty string if the child predicates is empty.

This means that binary operations can be used along with clauses expecting predicates without the need to check for undefined:

```ts
const n = new Cypher.Node();
new Cypher.Match(n).where(Cypher.and(undefined)).return(n);
```

Will generate:

```cypher
MATCH (n)
RETURN n
```
