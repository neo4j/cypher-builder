---
"@neo4j/cypher-builder": patch
---

Fix order of set remove subclauses. The generated cypher will now maintain the order of multiple `SET` and `REMOVE` statements.

For example:

```js
const matchQuery = new Cypher.Match(new Cypher.Pattern(personNode, { labels: ["Person"] }))
    .where(personNode, { name: nameParam })
    .set([personNode.property("name"), evilKeanu])
    .remove(personNode.property("anotherName"))
    .set([personNode.property("anotherName"), new Cypher.Param(nameParam)])
    .set([personNode.property("oldName"), new Cypher.Param(nameParam)])
    .return(personNode);
```

Before

```cypher
MATCH (this0:Person)
WHERE this0.name = $param0
SET
    this0.name = $param1
    this0.anotherName = $param2,
    this0.oldName = $param3
REMOVE this0.anotherName
RETURN this0
```

After

```cypher
MATCH (this0:Person)
WHERE this0.name = $param0
SET
    this0.name = $param1
REMOVE this0.anotherName
SET
    this0.anotherName = $param2,
    this0.oldName = $param3
RETURN this0
```
