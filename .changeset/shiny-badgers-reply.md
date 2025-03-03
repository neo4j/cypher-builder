---
"@neo4j/cypher-builder": patch
---

New options to disable automatic escaping of labels and relationship types have been added to the `.build` method on clauses, inside the new object `unsafeEscapeOptions`:

- `disableLabelEscaping` (defaults to `false`): If set to true, node labels will not be escaped if unsafe.
- `disableRelationshipTypeEscaping` (defaults to `false`): If set to true, relationship types will not be escaped if unsafe

For example:

```js
const personNode = new Cypher.Node();
const movieNode = new Cypher.Node();

const matchQuery = new Cypher.Match(
    new Cypher.Pattern(personNode, {
        labels: ["Person"],
        properties: {
            ["person name"]: new Cypher.Literal(`Uneak "Seveer`),
        },
    })
        .related({ type: "ACTED IN" })
        .to(movieNode, { labels: ["A Movie"] })
).return(personNode);

const queryResult = matchQuery.build({
    unsafeEscapeOptions: {
        disableLabelEscaping: true,
        disableRelationshipTypeEscaping: true,
    },
});
```

This query will generate the following (invalid) Cypher:

```
MATCH (this0:Person { `person name`: "Uneak \"Seveer" })-[:ACTED IN]->(this1:A Movie)
RETURN this0
```

Instead of the default (safe) Cypher:

```cypher
MATCH (this0:Person { `person name`: "Uneak \"Seveer" })-[:`ACTED IN`]->(this1:`A Movie`)
RETURN this0
```

**WARNING:**: Changing these options may lead to code injection and unsafe Cypher.
