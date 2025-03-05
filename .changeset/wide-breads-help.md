---
"@neo4j/cypher-builder": patch
---

Rename `disableLabelEscaping` to `disableNodeLabelEscaping` in `unsafeEscapeOptions`:

```js
const queryResult = matchQuery.build({
    unsafeEscapeOptions: {
        disableNodeLabelEscaping: true,
        disableRelationshipTypeEscaping: true,
    },
});
```
