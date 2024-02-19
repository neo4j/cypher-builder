---
"@neo4j/cypher-builder": minor
---

Add support for Collect subqueries:

```js
const dog = new Cypher.Node({ labels: ["Dog"] });
const person = new Cypher.Node({ labels: ["Person"] });

const subquery = new Cypher.Match(
    new Cypher.Pattern(person).related(new Cypher.Relationship({ type: "HAS_DOG" })).to(dog)
).return(dog.property("name"));

const match = new Cypher.Match(person)
    .where(Cypher.in(new Cypher.Literal("Ozzy"), new Cypher.Collect(subquery)))
    .return(person);
```

```cypher
MATCH (this0:Person)
WHERE "Ozzy" IN COLLECT {
    MATCH (this0:Person)-[this1:HAS_DOG]->(this2:Dog)
    RETURN this2.name
}
RETURN this0
```
