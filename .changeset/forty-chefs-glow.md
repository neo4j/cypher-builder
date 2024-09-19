---
"@neo4j/cypher-builder": minor
---

Add support for SHORTEST keyword in match and its variations:

-   `.shortest(k)`
-   `.shortestGroups(k)`
-   `.allShortest`
-   `.any`

For example:

```js
new Cypher.Match(pattern).shortest(2).return(node);
```

```cypher
MATCH ALL SHORTEST (this0:Movie)-[this1]->(this2:Person)
RETURN this0
```
