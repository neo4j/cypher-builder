---
"@neo4j/cypher-builder": patch
---

Add support for multiple expressions on the simple CASE:

```cypher
matchClause.return(
    new Cypher.Case(person.property("eyes"))
        .when(new Cypher.Literal("brown"), new Cypher.Literal("hazel"))
        .then(new Cypher.Literal(2))
```
