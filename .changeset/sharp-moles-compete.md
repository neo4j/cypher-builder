---
"@neo4j/cypher-builder": minor
---

Add `isNormalized` and `isNotNormalized` operators:

```
const stringLiteral = new Cypher.Literal("the \\u212B char");
const query = new Cypher.Return([Cypher.isNormalized(stringLiteral, "NFC"), "normalized"]);
const { cypher } = query.build();
```

```
RETURN "the \u212B char" IS NFC NORMALIZED AS normalized
```
