---
"@neo4j/cypher-builder": patch
---

Escapes variables using the following reserved words (case insensitive):

- `where`
- `is`
- `contains`
- `in`

For example:

```js
new Cypher.NamedVariable("Where").property("title");
```

Generates the following Cypher

```cypher
`Where`.title
```
