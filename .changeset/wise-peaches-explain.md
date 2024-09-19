---
"@neo4j/cypher-builder": major
---

Fix TypeScript typings for boolean operators when using array spread:

-   `Cypher.and`
-   `Cypher.or`
-   `Cypher.xor`

The following:

```ts
const predicates: Cypher.Predicate[] = [];
const andPredicate = Cypher.and(...predicates);
```

Will now return the correct type `Cypher.Predicate | undefined`. This change means that additional checks may be needed when using boolean operators:

```ts
const predicates = [Cypher.true, Cypher.false];
const andPredicate = Cypher.and(...predicates); // type Cypher.Predicate | undefined
```

Passing parameters without spread will still return a defined type
